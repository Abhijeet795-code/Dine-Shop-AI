-- ----------------------------------------------------------------------------
-- Some shops ended up with duplicate categories that only differ by case
-- (e.g. "Starters" and "starters"). This caused
-- findByShop_ShopIdAndCategoryNameIgnoreCase to throw NonUniqueResultException
-- (-> 500) whenever a menu item update/create matched such a pair.
--
-- Step 1: repoint any menu_items pointing at a "duplicate" category onto the
--         oldest (first-created) category row for that shop+name.
-- Step 2: delete the now-unreferenced duplicate category rows.
-- Step 3: add a unique index so duplicates can never be created again.
-- ----------------------------------------------------------------------------

WITH ranked AS (
    SELECT
        category_id,
        shop_id,
        lower(category_name) AS name_key,
        row_number() OVER (
            PARTITION BY shop_id, lower(category_name)
            ORDER BY category_id
        ) AS rn
    FROM categories
),
keep_map AS (
    SELECT
        dup.category_id AS dup_id,
        keep.category_id AS keep_id
    FROM ranked dup
    JOIN ranked keep
      ON keep.shop_id = dup.shop_id
     AND keep.name_key = dup.name_key
     AND keep.rn = 1
    WHERE dup.rn > 1
)
UPDATE menu_items
SET category_id = keep_map.keep_id
FROM keep_map
WHERE menu_items.category_id = keep_map.dup_id;

WITH ranked AS (
    SELECT
        category_id,
        row_number() OVER (
            PARTITION BY shop_id, lower(category_name)
            ORDER BY category_id
        ) AS rn
    FROM categories
)
DELETE FROM categories
WHERE category_id IN (SELECT category_id FROM ranked WHERE rn > 1);

CREATE UNIQUE INDEX uq_categories_shop_id_name_lower
    ON categories (shop_id, lower(category_name));
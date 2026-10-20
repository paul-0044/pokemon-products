import json
import shutil
import os

os.makedirs('public/data', exist_ok=True)

# 1. Products
shutil.copyfile('crawler_data/products/all_products.json', 'public/data/products.json')

# 2. Collections
shutil.copyfile('crawler_data/collections/collections.json', 'public/data/collections.json')

# 3. Navigation
shutil.copyfile('crawler_data/navigation.json', 'public/data/navigation.json')

# 4. Pages
shutil.copyfile('crawler_data/pages/all_pages.json', 'public/data/pages.json')

# 5. Policies
shutil.copyfile('crawler_data/policies/all_policies.json', 'public/data/policies.json')

print("Copied all core store datasets to public/data/ successfully!")

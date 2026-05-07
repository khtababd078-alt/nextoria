import pandas as pd

df = pd.read_excel('ai/data.xlsx', sheet_name='DATASET')

sample = df[['التخصصات', 'الحقل', 'الحد التنافسي لسنة 2024', 'الحد التنافسي لسنة 2023', 'الحد التنافسي المتوقع']]\
    .drop_duplicates('التخصصات').sort_values('الحقل')

for _, row in sample.iterrows():
    t = row['الحد التنافسي لسنة 2024']
    if not t or str(t) == 'nan':
        t = row['الحد التنافسي لسنة 2023']
    if not t or str(t) == 'nan':
        t = row['الحد التنافسي المتوقع']
    print(f"{row['التخصصات']} | {row['الحقل']} | {t}")

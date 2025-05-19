import pandas as pd
import json

# Đọc file CSV
# Thay 'ten_file.csv' bằng đường dẫn thực tế đến file CSV của bạn

# Đọc file, dùng converter để chuyển chuỗi annotations thành list
df = pd.read_csv('D:\\Downloads\\train.csv\\train.csv', converters={'annotations': eval})

# Lọc bỏ dòng có annotations là list rỗng
df = df[df['video_id'].apply(lambda x: x == 2)]
# df = df[df['annotations'].apply(lambda x: x != [])]
print((df))
print(len(df))
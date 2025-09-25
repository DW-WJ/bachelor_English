# 显示词汇表内容的简单脚本

# 文件路径
vocabulary_path = r'i:\glodon_dmk\my study\trae\bachelor_English\单词\学位英语词汇表.txt'

print(f"正在读取文件：{vocabulary_path}")
print("=" * 50)

try:
    # 打开文件并读取内容
    with open(vocabulary_path, 'r', encoding='utf-8') as file:
        # 读取前200行内容
        lines = []
        for i in range(200):
            line = file.readline()
            if not line:
                break
            lines.append(line.strip())
        
        # 显示内容
        print("\n".join(lines))
        print(f"\n已显示前{len(lines)}行内容")
        print("=" * 50)
        print("如需查看更多内容，请修改脚本中的行数限制")
        
except Exception as e:
    print(f"读取文件时出错：{str(e)}")
    print("请检查文件路径是否正确")
# 简单的学位英语词汇表解析器

import os

# 文件路径
vocabulary_txt_path = r'i:\glodon_dmk\my study\trae\bachelor_English\单词\学位英语词汇表.txt'
output_md_path = r'i:\glodon_dmk\my study\trae\bachelor_English\单词\基础词汇表.md'

def parse_vocabulary():
    """简单解析词汇表文本文件"""
    print(f"正在解析文件：{vocabulary_txt_path}")
    
    # 按字母分类的单词列表
    vocabulary_dict = {}
    current_letter = None
    word_count = 0
    
    try:
        with open(vocabulary_txt_path, 'r', encoding='utf-8') as file:
            lines = file.readlines()
            
            for line in lines:
                line = line.strip()
                
                # 跳过空行和页面标题/分隔符
                if not line or '天一英语' in line or '词汇表' in line or line.startswith('=') or line.startswith('-'):
                    continue
                
                # 检查是否是字母标题（如'A'）
                if len(line) == 1 and line.isalpha():
                    current_letter = line.upper()
                    if current_letter not in vocabulary_dict:
                        vocabulary_dict[current_letter] = []
                    continue
                
                # 处理单词行
                if current_letter:
                    # 简单处理：将整行作为单词信息
                    vocabulary_dict[current_letter].append(line)
                    word_count += 1
    
    except Exception as e:
        print(f"解析文件时出错：{str(e)}")
        return None, 0
    
    print(f"成功解析，共提取到{word_count}个单词")
    for letter, words in vocabulary_dict.items():
        print(f"{letter}: {len(words)}个单词")
    
    return vocabulary_dict, word_count

def generate_md_file(vocabulary_dict):
    """生成Markdown文件"""
    print(f"正在生成Markdown文件：{output_md_path}")
    
    try:
        with open(output_md_path, 'w', encoding='utf-8') as md_file:
            # 写入标题和说明
            md_file.write("# 学位英语基础词汇表\n\n")
            md_file.write("## 说明\n")
            md_file.write("本词汇表根据教材《学位英语词汇表.pdf》自动提取整理，带*号的单词为要求复用式掌握的词汇。\n\n")
            md_file.write("## 词汇表结构\n")
            md_file.write("按照字母顺序整理，每个单词包含：单词、音标、词性、释义。\n\n")
            md_file.write("---\n\n")
            
            # 按字母顺序写入单词
            for letter in sorted(vocabulary_dict.keys()):
                md_file.write(f"## {letter}开头单词\n\n")
                
                for word_info in vocabulary_dict[letter]:
                    # 尝试提取单词部分（第一个空格前的内容）
                    parts = word_info.split(' ', 1)
                    if len(parts) > 0:
                        word_part = parts[0]
                        # 检查是否是带*的重点单词
                        if '*' in word_part:
                            md_file.write(f"### {word_part}\n")
                        else:
                            md_file.write(f"### {word_part}\n")
                        
                        # 写入剩余部分作为解释
                        if len(parts) > 1:
                            md_file.write(f"- {parts[1]}\n")
                        md_file.write("\n")
                
                md_file.write("---\n\n")
    
    except Exception as e:
        print(f"生成Markdown文件时出错：{str(e)}")
        return False
    
    print(f"Markdown文件生成成功！")
    return True

def main():
    """主函数"""
    print("====== 开始处理学位英语词汇表 ======")
    
    # 解析词汇表文件
    vocabulary_dict, word_count = parse_vocabulary()
    if not vocabulary_dict or word_count == 0:
        print("解析失败或未提取到单词，无法继续处理")
        return
    
    # 生成Markdown文件
    if generate_md_file(vocabulary_dict):
        print("词汇表生成完成！")
        print(f"请查看文件：{output_md_path}")
    else:
        print("词汇表生成失败！")
    
    print("====== 处理完成 ======")

if __name__ == "__main__":
    main()
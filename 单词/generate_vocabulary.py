# 解析学位英语词汇表并生成结构化的词汇表文件

import re
import os

# 文件路径
vocabulary_txt_path = r'i:\glodon_dmk\my study\trae\bachelor_English\单词\学位英语词汇表.txt'
output_md_path = r'i:\glodon_dmk\my study\trae\bachelor_English\单词\基础词汇表.md'

def parse_vocabulary_file():
    """解析词汇表文本文件，提取单词信息"""
    print(f"正在解析文件：{vocabulary_txt_path}")
    
    # 按字母分类的单词字典
    vocabulary_dict = {}
    
    # 当前处理的字母
    current_letter = None
    
    # 正则表达式模式，用于匹配单词行
    # 匹配模式：单词(带可选的*) [音标] 词性. 释义
    word_pattern = re.compile(r'^([a-zA-Z]+\*?)(?:\s+\[(.*?)\])?\s+([a-zA-Z./]+\.?)(.*)$')
    
    try:
        with open(vocabulary_txt_path, 'r', encoding='utf-8') as file:
            for line in file:
                line = line.strip()
                
                # 跳过空行和页面标题
                if not line or '天一英语' in line or '词汇表' in line or line.startswith('=') or line.startswith('-'):
                    continue
                
                # 检查是否是字母标题（如'A'）
                if len(line) == 1 and line.isalpha():
                    current_letter = line.upper()
                    if current_letter not in vocabulary_dict:
                        vocabulary_dict[current_letter] = []
                    continue
                
                # 尝试匹配单词行
                match = word_pattern.match(line)
                if match and current_letter:
                    word_info = match.groups()
                    word = word_info[0].strip()
                    phonetic = word_info[1].strip() if word_info[1] else ''
                    pos = word_info[2].strip()
                    definition = word_info[3].strip()
                    
                    # 去除单词中的*号（如果有）
                    is_key_word = False
                    if '*' in word:
                        is_key_word = True
                        word = word.replace('*', '')
                    
                    # 添加到字典中
                    vocabulary_dict[current_letter].append({
                        'word': word,
                        'phonetic': phonetic,
                        'pos': pos,
                        'definition': definition,
                        'is_key_word': is_key_word
                    })
    
    except Exception as e:
        print(f"解析文件时出错：{str(e)}")
        return None
    
    print(f"成功解析，共提取到{sum(len(words) for words in vocabulary_dict.values())}个单词")
    for letter, words in vocabulary_dict.items():
        print(f"{letter}: {len(words)}个单词")
    
    return vocabulary_dict

def generate_md_file(vocabulary_dict):
    """根据解析出的单词信息生成Markdown文件"""
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
                    word = word_info['word']
                    phonetic = word_info['phonetic']
                    pos = word_info['pos']
                    definition = word_info['definition']
                    is_key_word = word_info['is_key_word']
                    
                    # 写入单词信息
                    if is_key_word:
                        md_file.write(f"### {word}* [{phonetic}]\n")
                    else:
                        md_file.write(f"### {word} [{phonetic}]\n")
                    
                    # 处理词性
                    if pos:
                        md_file.write(f"- **{pos}** {definition}\n")
                    else:
                        md_file.write(f"- {definition}\n")
                    
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
    vocabulary_dict = parse_vocabulary_file()
    if not vocabulary_dict:
        print("解析失败，无法继续处理")
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
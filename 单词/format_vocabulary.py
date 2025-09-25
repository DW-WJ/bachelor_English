# 优化学位英语词汇表格式的脚本

import os

# 文件路径
vocabulary_md_path = r'i:\glodon_dmk\my study\trae\bachelor_English\单词\基础词汇表.md'
output_md_path = r'i:\glodon_dmk\my study\trae\bachelor_English\单词\学位英语词汇表_优化版.md'

def format_vocabulary():
    """优化词汇表格式，确保每个单词的所有信息都在一个条目中"""
    print(f"正在优化词汇表格式：{vocabulary_md_path}")
    
    try:
        with open(vocabulary_md_path, 'r', encoding='utf-8') as file:
            lines = file.readlines()
        
        formatted_lines = []
        current_word = None
        current_definition = []
        in_letter_section = False
        letter_section_title = None
        
        for line in lines:
            line = line.strip()
            
            # 处理标题和说明部分
            if line.startswith('#') or line.startswith('##') and not line.startswith('## ') and not line.startswith('## A') and not line.startswith('## B') and not line.startswith('## C') and not line.startswith('## D') and not line.startswith('## E') and not line.startswith('## F') and not line.startswith('## G') and not line.startswith('## H') and not line.startswith('## I') and not line.startswith('## J') and not line.startswith('## K') and not line.startswith('## L') and not line.startswith('## M') and not line.startswith('## N') and not line.startswith('## O') and not line.startswith('## P') and not line.startswith('## Q') and not line.startswith('## R') and not line.startswith('## S') and not line.startswith('## T') and not line.startswith('## U') and not line.startswith('## V') and not line.startswith('## W') and not line.startswith('## X') and not line.startswith('## Y') and not line.startswith('## Z'):
                formatted_lines.append(line)
            elif line.startswith('## ') and len(line) > 3 and line[3].isalpha():
                # 字母分类标题
                if current_word:
                    # 保存上一个单词
                    formatted_lines.append(f"### {current_word}")
                    if current_definition:
                        formatted_lines.append(f"- {', '.join(current_definition)}")
                        formatted_lines.append('')
                    current_word = None
                    current_definition = []
                
                # 添加字母分类标题
                formatted_lines.append('')
                formatted_lines.append(line)
                formatted_lines.append('')
            elif line.startswith('---'):
                formatted_lines.append(line)
            elif line.startswith('### '):
                # 单词标题
                if current_word:
                    # 保存上一个单词
                    formatted_lines.append(f"### {current_word}")
                    if current_definition:
                        formatted_lines.append(f"- {', '.join(current_definition)}")
                        formatted_lines.append('')
                
                # 开始新单词
                current_word = line[4:]
                current_definition = []
            elif line.startswith('- ') and current_word:
                # 单词释义行
                definition_part = line[2:]
                current_definition.append(definition_part)
            elif current_word and line:
                # 多行释义的情况
                if not line.startswith('- ') and not line.startswith('### ') and not line.startswith('## ') and not line.startswith('---') and not line.startswith('#'):
                    current_definition.append(line)
        
        # 处理最后一个单词
        if current_word:
            formatted_lines.append(f"### {current_word}")
            if current_definition:
                formatted_lines.append(f"- {', '.join(current_definition)}")
                formatted_lines.append('')
        
        # 保存优化后的文件
        with open(output_md_path, 'w', encoding='utf-8') as file:
            file.write('\n'.join(formatted_lines))
        
        print(f"词汇表格式优化完成！")
        print(f"已保存到：{output_md_path}")
        return True
        
    except Exception as e:
        print(f"优化词汇表格式时出错：{str(e)}")
        return False

def main():
    """主函数"""
    print("====== 开始优化学位英语词汇表格式 ======")
    
    if format_vocabulary():
        print("词汇表格式优化成功！")
    else:
        print("词汇表格式优化失败！")
    
    print("====== 处理完成 ======")

if __name__ == "__main__":
    main()
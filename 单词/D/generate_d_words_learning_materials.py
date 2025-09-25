#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
学位英语词汇学习资料生成脚本 - D字母
功能：从词汇表中提取D开头的单词，并按学位英语词汇学习案例示范格式生成学习资料
每个文件包含50个单词，包含6个学习模块、例句设计、学习记录表格和总结
"""

import os
import re

# 设置文件路径
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
VOCABULARY_FILE = os.path.join(os.path.dirname(BASE_DIR), '学位英语词汇表_优化版.md')
OUTPUT_DIR = BASE_DIR

# 创建输出目录（如果不存在）
os.makedirs(OUTPUT_DIR, exist_ok=True)


def extract_words_from_file(file_path):
    """
    从文件中提取D开头的单词，处理多行词性和释义的情况
    """
    words = []
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
            
            # 先找到D开头单词的部分
            d_section_pattern = r'##\s+D开头单词\s+((?:###.*?\n)+?)###\s+[A-Z]\w+'
            d_section_match = re.search(d_section_pattern, content, re.DOTALL)
            
            if d_section_match:
                d_section = d_section_match.group(1)
                
                # 匹配每个D开头的单词（带音标和词性的第一行）
                word_pattern = r'###\s+(D\w+?)\*?\[([^\]]+)\](\w+\.?)\s+(.+?)\n'
                word_matches = re.finditer(word_pattern, d_section)
                
                for match in word_matches:
                    word, phonetic, speech, meaning = match.groups()
                    
                    # 查找该单词可能的后续词性和释义
                    next_lines = d_section[match.end():]
                    additional_meanings = []
                    
                    # 匹配后续的词性和释义行
                    additional_pattern = r'^###\s+([a-z]+\.?)\s+(.+?)\n'  # 匹配如：### n.日报 这样的行
                    additional_matches = re.finditer(additional_pattern, next_lines, re.MULTILINE)
                    
                    for add_match in additional_matches:
                        add_speech, add_meaning = add_match.groups()
                        additional_meanings.append(f"{add_speech} {add_meaning}")
                        # 检查下一行是否还是这个单词的内容
                        next_pos = add_match.end()
                        if next_pos < len(next_lines):
                            next_char = next_lines[next_pos]
                            if next_char == '#' and not next_lines[next_pos:next_pos+4].startswith('### '):
                                break  # 不是###开头的行，结束查找
                        
                    # 合并所有含义
                    full_meaning = meaning
                    if additional_meanings:
                        full_meaning += '；' + '；'.join(additional_meanings)
                    
                    words.append({
                        'word': word,
                        'phonetic': phonetic,
                        'speech': speech,
                        'meaning': full_meaning
                    })
        
        # 如果没有通过节段匹配找到足够单词，使用备用方法
        if not words or len(words) < 10:
            print(f"通过节段匹配提取到 {len(words)} 个D开头的单词，尝试使用备用方法...")
            words = []
            
            # 备用方法：直接匹配所有D开头的单词行，改进正则表达式以匹配更多格式
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
                # 匹配格式：### Dword[音标]... 支持*标记和各种格式变化
                pattern = r'###\s+(D\w+?)\*?\[([^\]]+)\]\s*([^\n]*)'
                matches = re.findall(pattern, content)
                
                # 去除重复项（使用集合去重）
                unique_words = {}
                
                for match in matches:
                    word, phonetic, rest = match
                    # 从rest中提取词性和含义
                    # 先去掉可能的换行和空格
                    rest = rest.strip()
                    
                    # 如果rest为空，尝试从下一行获取信息
                    if not rest:
                        # 简单处理，将含义设为"待补充"
                        speech = "n."  # 默认设为名词
                        meaning = "待补充"
                    else:
                        # 尝试匹配词性和含义，考虑多种可能的格式
                        speech_meaning_pattern = r'(\w+\.?)\s+(.+)'
                        sm_match = re.match(speech_meaning_pattern, rest)
                        if sm_match:
                            speech, meaning = sm_match.groups()
                        else:
                            # 尝试其他可能的格式
                            speech = "n."  # 默认设为名词
                            meaning = rest
                    
                    # 存储单词信息，避免重复
                    if word not in unique_words:
                        unique_words[word] = {
                            'word': word,
                            'phonetic': phonetic,
                            'speech': speech,
                            'meaning': meaning
                        }
                
                # 将去重后的单词添加到列表中
                words = list(unique_words.values())
        
        print(f"成功提取到 {len(words)} 个D开头的单词")
        return words
    except Exception as e:
        print(f"提取单词时出错: {e}")
        return []


def generate_vocabulary_basic_info(word_info):
    """
    生成模块1：词汇基础解析
    """
    word = word_info['word']
    phonetic = word_info['phonetic']
    speech = word_info['speech']
    meaning = word_info['meaning']
    
    # 词根词缀拆解（这里简化处理）
    root_affix = "**词根词缀拆解**：\n"
    root_affix += f"- {word} = 暂无详细词根词缀信息\n"
    root_affix += f"- 构词逻辑：暂无详细构词逻辑信息\n"
    root_affix += f"- 同根词：暂无同根词信息\n"
    
    # 核心信息标准化输出
    core_info = "\n**核心信息标准化输出**：\n"
    core_info += f"- 音标：[{phonetic}]\n"
    core_info += f"- 词性：{speech}\n"
    core_info += "- 核心含义：\n"
    
    # 处理多个含义
    meanings = meaning.split('；')
    if len(meanings) > 0:
        core_info += f"  - ★★★★★ {meanings[0]}\n"
    if len(meanings) > 1:
        for m in meanings[1:]:
            core_info += f"  - ★★★★☆ {m}\n"
    
    core_info += f"- 词源：暂无词源信息\n"
    
    return f"### 模块1：词汇基础解析\n\n{root_affix}{core_info}\n"


def generate_exam_focus(word_info):
    """
    生成模块2：考点聚焦
    """
    word = word_info['word']
    
    # 高频考点标注
    exam_focus = "**高频考点标注**：\n"
    exam_focus += "- **考试常考义项**：\n"
    exam_focus += "  - ★★★★★ 根据上下文理解单词在句子中的具体含义\n"
    exam_focus += "  - ★★★★☆ 掌握单词的常见搭配和固定用法\n"
    
    exam_focus += "- **高频题型关联**：\n"
    exam_focus += "  - 阅读理解占比约40%-60%\n"
    exam_focus += "  - 完形填空占比约20%-30%\n"
    
    # 必记搭配
    exam_focus += "- **必记搭配**：\n"
    if word == "do":
        exam_focus += "  - 📌 do homework：做作业\n"
        exam_focus += "    例句框架：I need to do my homework.\n"
        exam_focus += "  - 📌 do some shopping：购物\n"
        exam_focus += "    例句框架：Let's do some shopping.\n"
    elif word == "date":
        exam_focus += "  - 📌 date with sb.：与某人约会\n"
        exam_focus += "    例句框架：She has a date with him.\n"
    elif word == "day":
        exam_focus += "  - 📌 every day：每天\n"
        exam_focus += "    例句框架：I study English every day.\n"
        exam_focus += "  - 📌 one day：某一天\n"
        exam_focus += "    例句框架：One day, I will visit Paris.\n"
    elif word == "different":
        exam_focus += "  - 📌 different from：与...不同\n"
        exam_focus += "    例句框架：My book is different from yours.\n"
    elif word == "difficult":
        exam_focus += "  - 📌 difficult to do sth.：做某事困难\n"
        exam_focus += "    例句框架：It's difficult to learn English.\n"
    else:
        exam_focus += f"  - 📌 {word} + 相关搭配：暂无特定搭配信息\n"
        exam_focus += f"    例句框架：The {word} is important.\n"
    
    # 考试陷阱预警
    exam_tips = "\n**考试陷阱预警**：\n"
    exam_tips += f"- ⚠️ 注意{word}的正确拼写和发音\n"
    exam_tips += f"- ⚠️ 在不同语境中可能有不同含义，注意根据上下文判断\n"
    exam_tips += "- **上下文判断技巧**：结合句子结构和上下文内容理解词义\n"
    
    return f"### 模块2：考点聚焦\n\n{exam_focus}{exam_tips}\n"


def generate_memory_enhancement(word_info):
    """
    生成模块3：记忆强化
    """
    word = word_info['word']
    speech = word_info['speech']
    meaning = word_info['meaning']
    
    # 轻量化记忆技巧
    memory_tips = "**轻量化记忆技巧**：\n"
    
    # 根据单词提供更具体的记忆场景
    if word == "do":
        memory_tips += "- **场景串联记忆**：\n"
        memory_tips += "  想象自己对朋友说：'I do my homework every day.'（我每天做作业）\n"
        memory_tips += "- **谐音辅助记忆**：无\n"
    elif word == "day":
        memory_tips += "- **场景串联记忆**：\n"
        memory_tips += "  想象自己指着日历说：'Today is a sunny day.'（今天是个晴天）\n"
        memory_tips += "- **谐音辅助记忆**：无\n"
    elif word == "different":
        memory_tips += "- **场景串联记忆**：\n"
        memory_tips += "  想象自己比较两个物品说：'These two books are different.'（这两本书不同）\n"
        memory_tips += "- **谐音辅助记忆**：无\n"
    else:
        memory_tips += "- **场景串联记忆**：\n"
        memory_tips += f"  想象在英语课堂上，老师正在讲解单词{word}，并给出了例句\n"
        memory_tips += "- **谐音辅助记忆**：暂无合适的谐音记忆法\n"
    
    memory_tips += "- **关联已知词**：尝试将该词与已学过的相关词汇联系起来记忆\n"
    
    # 易混词对比
    confusion_words = "\n**易混词对比**：\n\n"
    confusion_words += "| 词汇 | 音标 | 核心区别（考试易考点） | 真题级例句 |\n"
    confusion_words += "|------|------|-------------------------|------------|\n"
    
    if word == "do":
        confusion_words += f"| {word} | [{word_info['phonetic']}] | 表示做、干的意思 | I do my best. |\n"
    elif word == "day":
        confusion_words += f"| {word} | [{word_info['phonetic']}] | 表示天、日 | We have seven days in a week. |\n"
    else:
        confusion_words += f"| {word} | [{word_info['phonetic']}] | 暂无详细对比信息 | 暂无详细例句 |\n"
    
    return f"### 模块3：记忆强化\n\n{memory_tips}{confusion_words}\n"


def generate_grammar_usage(word_info):
    """
    生成模块4：语法与场景应用
    """
    word = word_info['word']
    speech = word_info['speech']
    meaning = word_info['meaning']
    
    # 高频词的特定例句
    specific_examples = {
        'do': [
            ("I do my homework every day.", "我每天做作业。", "do表示做、干"),
            ("Do you like English?", "你喜欢英语吗？", "do用于疑问句辅助动词")
        ],
        'date': [
            ("Today is an important date.", "今天是个重要的日期。", "date表示日期"),
            ("She has a date with him.", "她和他有个约会。", "date表示约会")
        ],
        'day': [
            ("Today is a sunny day.", "今天是个晴天。", "day表示天"),
            ("I study English every day.", "我每天学习英语。", "every day表示每天")
        ],
        'different': [
            ("These two books are different.", "这两本书不同。", "different表示不同的"),
            ("My opinion is different from yours.", "我的意见和你的不同。", "different from表示与...不同")
        ],
        'difficult': [
            ("English is not difficult for me.", "英语对我来说不难。", "difficult表示困难的"),
            ("It's difficult to learn Chinese.", "学习中文很难。", "difficult to do表示做某事困难")
        ],
        'doctor': [
            ("He is a good doctor.", "他是个好医生。", "doctor表示医生"),
            ("You should see a doctor.", "你应该去看医生。", "see a doctor表示看医生")
        ],
        'door': [
            ("Please open the door.", "请开门。", "door表示门"),
            ("The door is closed.", "门是关着的。", "closed描述门的状态")
        ],
        'drink': [
            ("I drink water every day.", "我每天喝水。", "drink表示喝"),
            ("Would you like a drink?", "你想喝一杯吗？", "drink作为名词表示饮料")
        ],
        'drive': [
            ("He can drive a car.", "他会开车。", "drive表示驾驶"),
            ("Let's drive to the park.", "我们开车去公园吧。", "drive to表示开车去某地")
        ]
    }
    
    # 例句设计与拆解
    examples = "**例句设计与拆解**：\n\n"
    examples += "| 例句内容 | 词汇拆分 | 语法标记 | 翻译 | 语法提示 |\n"
    examples += "|---------|---------|---------|------|---------|\n"
    
    # 生成例句
    if word in specific_examples:
        # 使用特定例句
        for example_sentence, translation, grammar_tip in specific_examples[word][:2]:
            # 简单的词汇拆分
            vocab_split = example_sentence.replace(word, f"{word} [{speech}] {meaning[:10]}...")
            grammar_mark = "一般现在时" if 'is' in example_sentence or 'are' in example_sentence else "简单句"
            examples += f"| {example_sentence} | {vocab_split} | {grammar_mark} | {translation} | {grammar_tip} |\n"
    else:
        # 为其他单词生成通用例句
        # 根据词性生成合适的例句
        if 'n.' in speech:
            example_sentence = f"The {word} is important."
            translation = f"这个{meaning.split('；')[0] if '；' in meaning else meaning}很重要。"
            grammar_tip = "作为名词在句子中作主语"
        elif 'v.' in speech:
            example_sentence = f"We should {word} it carefully."
            translation = f"我们应该仔细地{meaning.split('；')[0] if '；' in meaning else meaning}它。"
            grammar_tip = "作为动词在句子中作谓语"
        elif 'adj.' in speech:
            example_sentence = f"This is a {word} example."
            translation = f"这是一个{meaning.split('；')[0] if '；' in meaning else meaning}的例子。"
            grammar_tip = "作为形容词修饰名词example"
        else:
            example_sentence = f"{word} is a keyword in this sentence."
            translation = f"在这个句子中，{word}是一个关键词。"
            grammar_tip = "在句子中作主语"
        
        # 简单的词汇拆分
        vocab_split = example_sentence.replace(word, f"{word} [{speech}] {meaning[:10]}...")
        grammar_mark = "一般现在时，简单句"
        examples += f"| {example_sentence} | {vocab_split} | {grammar_mark} | {translation} | {grammar_tip} |\n"
    
    # 题型适配技巧
    skill_tips = "\n**题型适配技巧**：\n"
    skill_tips += f"- **针对阅读**：在阅读中遇到{word}时，结合上下文理解其含义\n"
    skill_tips += f"- **针对完形**：注意{word}的固定搭配和语法用法\n"
    skill_tips += f"- **针对写作**：尝试在写作中使用{word}，提升表达多样性\n"
    
    return f"### 模块4：语法与场景应用\n\n{examples}{skill_tips}\n"


def generate_self_test_review(word_info):
    """
    生成模块5：自测与复习规划
    """
    word = word_info['word']
    
    # 即时自测题
    self_test = "**即时自测题**：\n\n"
    
    # 选词填空题
    self_test += "1. **选词填空**：\n"
    if word == "do":
        self_test += "   I ____ my homework every day.\n"
        self_test += "   A. do  B. does  C. did\n"
        self_test += "   答案：A\n"
        self_test += "   解析：主语是I，动词用原形do\n"
    elif word == "day":
        self_test += "   There are seven ____ in a week.\n"
        self_test += "   A. day  B. days  C. dayes\n"
        self_test += "   答案：B\n"
        self_test += "   解析：seven表示复数，day的复数是days\n"
    elif word == "different":
        self_test += "   My book is ____ from yours.\n"
        self_test += "   A. different  B. same  C. difficult\n"
        self_test += "   答案：A\n"
        self_test += "   解析：different from表示与...不同\n"
    else:
        self_test += f"   We should remember the word ____.\n"
        self_test += f"   A. {word}  B. test  C. example\n"
        self_test += f"   答案：A\n"
        self_test += f"   解析：根据句子意思，这里需要填入{word}\n"
    
    self_test += "\n"
    
    # 语法判断题
    self_test += "2. **语法判断**：\n"
    if word == "do":
        self_test += "   句子'She do her homework.'是否正确？\n"
        self_test += "   答案：不正确\n"
        self_test += "   解析：主语是第三人称单数，应该用does\n"
    elif word == "day":
        self_test += "   句子'One day, I will visit Beijing.'是否正确？\n"
        self_test += "   答案：正确\n"
        self_test += "   解析：one day表示将来的某一天，用将来时\n"
    else:
        self_test += f"   句子'I {word} this book.'是否正确？\n"
        self_test += "   答案：需要根据具体语境判断\n"
        self_test += "   解析：如果{word}是及物动词，这个句子结构正确\n"
    
    # 艾宾浩斯复习提示
    review_plan = "\n**艾宾浩斯复习提示**：\n"
    review_plan += "- **第1次复习**：学完当天睡前（5分钟）\n"
    review_plan += f"  重点看：必记搭配 + {word}的核心含义\n"
    review_plan += "- **第2次复习**：第2天早上（3分钟）\n"
    review_plan += f"  快速过：{word}的拼写、发音和主要例句\n"
    review_plan += "- **第3次复习**：第7天（5分钟）\n"
    review_plan += f"  重做自测题，检查是否真正掌握{word}\n"
    
    return f"### 模块5：自测与复习规划\n\n{self_test}{review_plan}\n"


def generate_personalized_interaction(word_info):
    """
    生成模块6：个性化交互示例
    """
    word = word_info['word']
    
    # 用户提问响应示例
    qa_examples = "**用户提问响应示例**：\n\n"
    qa_examples += f"1. **用户问**：'{word}重点考什么？'\n"
    qa_examples += f"   **响应**：{word}在学位英语考试中主要考查其基本含义和用法，特别是在阅读理解和完形填空中的应用。建议重点掌握其核心含义、常见搭配和语法用法。\n\n"
    
    qa_examples += f"2. **用户问**：'怎么记{word}这个词？'\n"
    qa_examples += f"   **响应**：推荐结合场景记忆法，将{word}放在具体的句子或场景中记忆。同时，可以通过联想记忆法，将{word}与已学过的相关词汇联系起来记忆。\n\n"
    
    qa_examples += f"3. **用户问**：'完形填空怎么用{word}？'\n"
    qa_examples += f"   **响应**：在完形填空中，使用{word}时需要注意其固定搭配和语法用法。结合上下文语境，判断{word}在句子中的词性和含义，选择正确的形式。\n"
    
    # 进度适配示例
    progress_examples = "\n**进度适配示例**：\n\n"
    progress_examples += f"1. **用户提及**：'已学过相关词汇'\n"
    progress_examples += f"   **响应**：在学习{word}时，可以主动关联已学过的相关词汇，对比它们的区别和联系，帮助更好地理解和记忆。\n\n"
    
    progress_examples += f"2. **用户提及**：'备考倒计时'\n"
    progress_examples += f"   **响应**：根据备考时间，调整复习计划，重点聚焦{word}的高频考点和核心用法，提高学习效率。\n"
    
    return f"### 模块6：个性化交互示例\n\n{qa_examples}{progress_examples}\n"


def generate_learning_materials(word_list, unit_num, total_units):
    """
    生成完整的学习资料
    """
    content = "# D字母单词学习资料_单元" + str(unit_num) + "\n\n"
    
    # 添加学习说明
    content += "## 📖 学习说明\n\n"
    content += "本资料按照学位英语词汇学习案例示范格式制作，包含完整的6个学习模块。\n"
    content += "请按照以下方法使用本资料：\n"
    content += "1. 每天学习一定数量的单词\n"
    content += "2. 每个单词都包含详细的例句和用法说明\n"
    content += "3. 完成每个单词的自测题\n"
    content += "4. 按照艾宾浩斯复习计划定期复习\n"
    content += "5. 在学习记录表格中记录学习情况\n\n"
    
    # 为每个单词生成学习案例
    for i, word_info in enumerate(word_list):
        word = word_info['word']
        content += "## 词汇学习案例：" + word + "\n\n"
        
        # 生成各个模块
        content += generate_vocabulary_basic_info(word_info)
        content += "---\n\n"
        content += generate_exam_focus(word_info)
        content += "---\n\n"
        content += generate_memory_enhancement(word_info)
        content += "---\n\n"
        content += generate_grammar_usage(word_info)
        content += "---\n\n"
        content += generate_self_test_review(word_info)
        content += "---\n\n"
        content += generate_personalized_interaction(word_info)
        
        # 在最后一个单词后不添加分隔线
        if i < len(word_list) - 1:
            content += "\n---\n\n"
    
    # 添加学习记录表格和总结
    content += "\n---\n\n"
    content += "## 📊 学习记录表格\n\n"
    content += "| 单词 | 掌握程度 | 学习日期 | 复习次数 | 备注 |\n"
    content += "|------|----------|----------|----------|------|\n"
    for word_info in word_list:
        content += "| " + word_info['word'] + " | ⭐⭐⭐ | | 0 | |\n"
    
    content += "\n## 📝 学习总结\n\n"
    content += "- **本单元单词数**：" + str(len(word_list)) + "个\n"
    content += "- **单元编号**：D" + str(unit_num) + "/" + str(total_units) + "\n"
    content += "- **学习进度**：0%\n"
    content += "- **已掌握单词**：0个\n"
    content += "- **重点单词**：需根据个人学习情况标记\n\n"
    
    content += "### 💪 学习鼓励\n"
    content += "坚持每天学习，相信你一定能够掌握这些单词，为学位英语考试打下坚实的基础！"
    
    return content


def main():
    """
    主函数
    """
    # 提取单词
    words = extract_words_from_file(VOCABULARY_FILE)
    if not words:
        print("没有提取到任何单词，程序退出。")
        return
    
    # 计算需要生成的文件数量
    words_per_file = 50
    total_files = (len(words) + words_per_file - 1) // words_per_file  # 向上取整
    
    # 生成多个学习资料文件
    for i in range(total_files):
        start_idx = i * words_per_file
        end_idx = min((i + 1) * words_per_file, len(words))
        current_words = words[start_idx:end_idx]
        
        # 生成学习资料
        unit_num = i + 1
        content = generate_learning_materials(current_words, unit_num, total_files)
        
        # 保存到文件
        output_file = os.path.join(OUTPUT_DIR, f"D字母单词学习资料_单元{unit_num}.md")
        with open(output_file, 'w', encoding='utf-8') as f:
            f.write(content)
        
        print(f"已生成: {output_file}")
    
    print(f"\n所有D字母单词学习资料已生成完成！共生成{total_files}个文件。")


if __name__ == "__main__":
    main()
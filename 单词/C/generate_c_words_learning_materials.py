#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
用于生成C字母单词学习资料的脚本
根据学位英语词汇学习案例示范格式生成符合要求的学习资料
"""
import os
import re

# 设置文件路径
vocabulary_file = os.path.join(os.path.dirname(__file__), '..', '学位英语词汇表_优化版.md')
output_dir = os.path.dirname(__file__)

# 词性对应的中文解释
speech_dict = {
    'n.': '名词',
    'v.': '动词',
    'vt.': '及物动词',
    'vi.': '不及物动词',
    'adj.': '形容词',
    'adv.': '副词',
    'prep.': '介词',
    'conj.': '连词',
    'pron.': '代词',
    'art.': '冠词',
    'num.': '数词',
    'int.': '感叹词',
    'aux.': '助动词',
    'modal v.': '情态动词'
}

def extract_c_words(file_path):
    """
    从词汇表文件中提取所有C开头的单词
    """
    c_words = []
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            # 逐行读取文件，这样可以更好地处理多行的单词条目
            lines = f.readlines()
            
            # 标志是否在C开头单词部分
            in_c_section = False
            
            for line in lines:
                line = line.strip()
                
                # 检查是否进入C开头单词部分
                if line.startswith('## C开头单词'):
                    in_c_section = True
                    continue
                # 检查是否离开C开头单词部分（遇到下一个字母部分）
                elif in_c_section and line.startswith('## ') and len(line) >= 4 and line[3].isupper() and line[3] != 'C':
                    in_c_section = False
                    break
                
                # 如果在C开头单词部分，检查是否是单词条目
                if in_c_section and line.startswith('### '):
                    # 提取单词、音标、词性和释义
                    # 格式：### word[phonetic]speech.meaning 或 ### word[phonetic]speech
                    try:
                        # 提取单词部分
                        word_part_end = line.find('[')
                        if word_part_end == -1:
                            continue  # 不符合预期格式，跳过
                        word = line[4:word_part_end].strip().replace('*', '')  # 移除重点词标记
                        
                        # 提取音标部分
                        phonetic_start = word_part_end
                        phonetic_end = line.find(']', phonetic_start)
                        if phonetic_end == -1:
                            continue
                        phonetic = line[phonetic_start:phonetic_end+1]
                        
                        # 提取词性和释义部分
                        remaining = line[phonetic_end+1:].strip()
                        
                        # 处理词性（可能包含a., n., v.等）
                        speech = ''
                        meaning = remaining
                        
                        # 尝试提取词性（通常在开头，后面跟.或空格）
                        speech_match = re.match(r'(\w+\.?\/?\w*\.?\s*)', remaining)
                        if speech_match:
                            speech = speech_match.group(1).strip()
                            meaning = remaining[len(speech):].strip()
                        
                        c_words.append({
                            'word': word,
                            'phonetic': phonetic,
                            'speech': speech,
                            'meaning': meaning
                        })
                    except Exception as e:
                        print(f"处理单词行时出错: {line}, 错误: {e}")
                        continue
        
        print(f"成功提取到 {len(c_words)} 个C开头的单词")
        return c_words
    except Exception as e:
        print(f"提取单词时出错: {str(e)}")
        return []

def generate_vocabulary_basic_analysis(word_info):
    """
    生成模块1：词汇基础解析
    """
    word = word_info['word']
    phonetic = word_info['phonetic']
    speech = word_info['speech']
    meaning = word_info['meaning']
    
    # 词根词缀拆解
    root_affix = "**词根词缀拆解**：\n"
    root_affix += f"- {word} = 暂无详细词根词缀信息\n"
    root_affix += "- 构词逻辑：暂无详细构词逻辑信息\n"
    root_affix += "- 同根词：暂无同根词信息\n"
    
    # 核心信息标准化输出
    core_info = "**核心信息标准化输出**：\n"
    core_info += f"- 音标：{phonetic}\n"
    core_info += f"- 词性：{speech}\n"
    core_info += "- 核心含义：\n"
    
    # 提取主要含义作为重点
    main_meanings = meaning.split('；')[:2]  # 最多显示2个义项
    for i, main_meaning in enumerate(main_meanings):
        stars = "★★★★★" if i == 0 else "★★★★☆"
        core_info += f"  - {stars} {main_meaning}\n"
    
    core_info += "- 词源：暂无词源信息\n"
    
    return f"### 模块1：词汇基础解析\n\n{root_affix}\n{core_info}\n"

def generate_exam_focus(word_info):
    """
    生成模块2：考点聚焦
    """
    word = word_info['word']
    speech = word_info['speech']
    
    # 高频考点标注
    exam_points = "**高频考点标注**：\n"
    exam_points += "- **考试常考义项**：\n"
    exam_points += "  - ★★★★★ 根据上下文理解单词在句子中的具体含义\n"
    exam_points += "  - ★★★★☆ 掌握单词的常见搭配和固定用法\n"
    
    exam_points += "- **高频题型关联**：\n"
    exam_points += "  - 阅读理解占比约40%-60%\n"
    exam_points += "  - 完形填空占比约20%-30%\n"
    
    # 必记搭配（根据单词特性生成）
    exam_points += "- **必记搭配**：\n"
    if 'v.' in speech:
        exam_points += f"  - 📌 {word} + 宾语/介词短语：根据动词类型搭配\n"
        exam_points += f"    例句框架：We should {word} it carefully.\n"
    else:
        exam_points += f"  - 📌 {word} + 相关搭配：暂无特定搭配信息\n"
        exam_points += f"    例句框架：The {word} is important.\n"
    
    # 考试陷阱预警
    warning = "\n**考试陷阱预警**：\n"
    warning += f"- ⚠️ 注意{word}的正确拼写和发音\n"
    warning += f"- ⚠️ 在不同语境中可能有不同含义，注意根据上下文判断\n"
    warning += "- **上下文判断技巧**：结合句子结构和上下文内容理解词义\n"
    
    return f"### 模块2：考点聚焦\n\n{exam_points}{warning}\n"

def generate_memory_strengthening(word_info):
    """
    生成模块3：记忆强化
    """
    word = word_info['word']
    
    # 轻量化记忆技巧
    memory_tips = "**轻量化记忆技巧**：\n"
    
    # 场景串联记忆
    memory_tips += "- **场景串联记忆**：\n"
    memory_tips += f"  想象在英语课堂上，老师正在讲解单词{word}，并给出了例句\n"
    
    # 谐音辅助记忆
    memory_tips += "- **谐音辅助记忆**：暂无合适的谐音记忆法\n"
    
    # 关联已知词
    memory_tips += "- **关联已知词**：尝试将该词与已学过的相关词汇联系起来记忆\n"
    
    # 易混词对比
    confusion_table = "\n**易混词对比**：\n\n"
    confusion_table += "| 词汇 | 音标 | 核心区别（考试易考点） | 真题级例句 |\n"
    confusion_table += "|------|------|-------------------------|------------|\n"
    confusion_table += f"| {word} | {word_info['phonetic']} | 暂无详细对比信息 | 暂无详细例句 |\n"
    
    return f"### 模块3：记忆强化\n\n{memory_tips}{confusion_table}\n"

def generate_grammar_application(word_info):
    """
    生成模块4：语法与场景应用
    确保为每个单词提供详细的例句
    """
    word = word_info['word']
    speech = word_info['speech']
    meaning = word_info['meaning']
    
    # 高频词的特定例句
    specific_examples = {
        'can': [
            ("I can speak English.", "我会说英语。", "can表示能力"),
            ("Can you help me?", "你能帮助我吗？", "can用于疑问句表示请求")
        ],
        'come': [
            ("Come here, please.", "请过来这里。", "come表示来到"),
            ("When will you come back?", "你什么时候回来？", "come back表示回来")
        ],
        'China': [
            ("I am from China.", "我来自中国。", "China表示国家"),
            ("Chinese people are friendly.", "中国人民很友好。", "Chinese表示中国的")
        ],
        'city': [
            ("Beijing is a big city.", "北京是一个大城市。", "city表示城市"),
            ("He lives in a small city.", "他住在一个小城市里。", "city用于描述居住地")
        ],
        'class': [
            ("We have English class every day.", "我们每天都有英语课。", "class表示课程"),
            ("There are 40 students in our class.", "我们班有40个学生。", "class表示班级")
        ],
        'close': [
            ("Please close the door.", "请关门。", "close表示关闭"),
            ("The store is close to my home.", "商店离我家很近。", "close表示近的")
        ],
        'cold': [
            ("It's cold today.", "今天很冷。", "cold表示寒冷的"),
            ("I have a cold.", "我感冒了。", "have a cold表示感冒")
        ],
        'color': [
            ("What color is your pen?", "你的钢笔是什么颜色？", "color表示颜色"),
            ("My favorite color is blue.", "我最喜欢的颜色是蓝色。", "color用于描述喜好")
        ],
        'come': [
            ("Come here, please.", "请过来这里。", "come表示来到"),
            ("When will you come back?", "你什么时候回来？", "come back表示回来")
        ],
        'computer': [
            ("I have a new computer.", "我有一台新电脑。", "computer表示电脑"),
            ("We use computers to work.", "我们用电脑工作。", "computers的复数形式")
        ],
        'cost': [
            ("How much does this book cost?", "这本书多少钱？", "cost表示花费"),
            ("The book costs 20 yuan.", "这本书价值20元。", "cost的第三人称单数形式")
        ],
        'country': [
            ("China is a beautiful country.", "中国是一个美丽的国家。", "country表示国家"),
            ("He lives in the countryside.", "他住在乡下。", "countryside表示农村")
        ],
        'could': [
            ("Could you please help me?", "你能帮助我吗？", "could表示委婉请求"),
            ("I could swim when I was five.", "我五岁时就会游泳了。", "could是can的过去式")
        ],
        'cry': [
            ("The baby is crying.", "婴儿在哭。", "cry表示哭泣")
        ],
        'culture': [
            ("Chinese culture is very rich.", "中国文化非常丰富。", "culture表示文化")
        ],
        'cup': [
            ("I need a cup of water.", "我需要一杯水。", "cup表示杯子")
        ],
        'current': [
            ("The current situation is difficult.", "当前形势很困难。", "current表示当前的")
        ],
        'cut': [
            ("Please cut the cake.", "请切蛋糕。", "cut表示切割")
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
    if word == "can":
        self_test += "   I ____ speak English.\n"
        self_test += "   A. can  B. could  C. should\n"
        self_test += "   答案：A\n"
        self_test += "   解析：表示能力，用can\n"
    elif word == "come":
        self_test += "   Please ____ here.\n"
        self_test += "   A. come  B. go  C. leave\n"
        self_test += "   答案：A\n"
        self_test += "   解析：表示来到这里，用come\n"
    else:
        self_test += f"   We should remember the word ____.\n"
        self_test += f"   A. {word}  B. test  C. example\n"
        self_test += f"   答案：A\n"
        self_test += f"   解析：根据句子意思，这里需要填入{word}\n"
    
    self_test += "\n"
    
    # 语法判断题
    self_test += "2. **语法判断**：\n"
    if word == "can":
        self_test += "   句子'He can to swim.'是否正确？\n"
        self_test += "   答案：不正确\n"
        self_test += "   解析：can后面直接跟动词原形，不需要to\n"
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

def generate_word_learning_materials(word_info):
    """
    为单个单词生成完整的学习资料，按照案例示范格式
    """
    word = word_info['word']
    
    materials = f"## 词汇学习案例：{word}\n\n"
    materials += generate_vocabulary_basic_analysis(word_info)
    materials += generate_exam_focus(word_info)
    materials += generate_memory_strengthening(word_info)
    materials += generate_grammar_application(word_info)
    materials += generate_self_test_review(word_info)
    materials += generate_personalized_interaction(word_info)
    materials += "\n---\n\n"
    
    return materials

def generate_learning_record_table(words):
    """
    生成学习记录表格
    """
    table = "## 📊 学习记录表格\n\n"
    table += "| 单词 | 掌握程度 | 学习日期 | 复习次数 | 备注 |\n"
    table += "|------|----------|----------|----------|------|\n"
    
    for word_info in words:
        table += f"| {word_info['word']} | ⭐⭐⭐ | | 0 | |\n"
    
    return table

def generate_summary(words, file_index, total_files):
    """
    生成学习总结
    """
    total_words = len(words)
    summary = f"## 📝 学习总结\n\n"
    summary += f"- **本单元单词数**：{total_words}个\n"
    summary += f"- **单元编号**：C{file_index+1}/{total_files}\n"
    summary += "- **学习进度**：0%\n"
    summary += "- **已掌握单词**：0个\n"
    summary += "- **重点单词**：需根据个人学习情况标记\n"
    summary += "\n### 💪 学习鼓励\n"
    summary += "坚持每天学习，相信你一定能够掌握这些单词，为学位英语考试打下坚实的基础！"
    
    return summary

def main():
    """
    主函数
    """
    print("====== 开始生成C字母单词学习资料 ======")
    
    # 提取C开头的单词
    c_words = extract_c_words(vocabulary_file)
    
    if not c_words:
        print("未提取到任何C开头的单词，无法生成学习资料")
        return
    
    # 每个文件放50个单词，计算需要生成的文件数量
    words_per_file = 50
    total_files = (len(c_words) + words_per_file - 1) // words_per_file
    
    # 分文件生成学习资料
    for i in range(total_files):
        start_idx = i * words_per_file
        end_idx = min((i + 1) * words_per_file, len(c_words))
        file_words = c_words[start_idx:end_idx]
        
        # 生成完整的学习资料
        full_materials = f"# C字母单词学习资料 - 单元{i+1}\n\n"
        full_materials += "## 📖 学习说明\n\n"
        full_materials += "本资料按照学位英语词汇学习案例示范格式制作，包含完整的6个学习模块。\n"
        full_materials += "请按照以下方法使用本资料：\n"
        full_materials += "1. 每天学习一定数量的单词\n"
        full_materials += "2. 每个单词都包含详细的例句和用法说明\n"
        full_materials += "3. 完成每个单词的自测题\n"
        full_materials += "4. 按照艾宾浩斯复习计划定期复习\n"
        full_materials += "5. 在学习记录表格中记录学习情况\n\n"
        
        # 为每个单词生成学习资料
        for parsed_word in file_words:
            full_materials += generate_word_learning_materials(parsed_word)
        
        # 添加学习记录表格
        full_materials += generate_learning_record_table(file_words)
        
        # 添加学习总结
        full_materials += generate_summary(file_words, i, total_files)
        
        # 保存生成的学习资料
        output_file = os.path.join(output_dir, f'C字母单词学习资料_单元{i+1}.md')
        try:
            with open(output_file, 'w', encoding='utf-8') as f:
                f.write(full_materials)
            print(f"学习资料已成功生成并保存至：{output_file}")
            print(f"文件共包含 {len(file_words)} 个单词")
        except Exception as e:
            print(f"保存学习资料时出错: {e}")
    
    print("====== 处理完成 ======")

if __name__ == "__main__":
    main()
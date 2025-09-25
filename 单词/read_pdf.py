import PyPDF2
import os

# 设置中文字体支持
import matplotlib
matplotlib.rcParams["font.family"] = ["SimHei", "WenQuanYi Micro Hei", "Heiti TC"]

# PDF文件路径
pdf_path = r'i:\glodon_dmk\my study\trae\bachelor_English\教材\学位英语词汇表.pdf'
# 输出文本文件路径
txt_path = r'i:\glodon_dmk\my study\trae\bachelor_English\单词\学位英语词汇表.txt'

try:
    # 检查PyPDF2是否安装，如果没有则尝试安装
    try:
        import PyPDF2
    except ImportError:
        print("正在安装PyPDF2库...")
        os.system(f"{os.sys.executable} -m pip install PyPDF2")
        import PyPDF2
    
    # 打开PDF文件
    with open(pdf_path, 'rb') as file:
        # 创建PDF阅读器对象
        reader = PyPDF2.PdfReader(file)
        
        # 获取PDF页数
        num_pages = len(reader.pages)
        print(f"PDF文件共有{num_pages}页")
        
        # 提取文本
        text = ""
        for page_num in range(num_pages):
            page = reader.pages[page_num]
            page_text = page.extract_text()
            text += f"\n\n====== 第{page_num + 1}页 ======\n"
            text += page_text
        
        # 保存提取的文本到文件
        with open(txt_path, 'w', encoding='utf-8') as txt_file:
            txt_file.write(text)
        
        print(f"文本内容已成功提取并保存到：{txt_path}")
        print("\n前500个字符预览：")
        print(text[:500])
        
except Exception as e:
    print(f"提取文本时出错：{str(e)}")
    print("尝试使用pdfplumber库...")
    
    try:
        # 尝试安装并使用pdfplumber
        os.system(f"{os.sys.executable} -m pip install pdfplumber")
        import pdfplumber
        
        text = ""
        with pdfplumber.open(pdf_path) as pdf:
            for page_num, page in enumerate(pdf.pages):
                page_text = page.extract_text()
                text += f"\n\n====== 第{page_num + 1}页 ======\n"
                text += page_text
        
        with open(txt_path, 'w', encoding='utf-8') as txt_file:
            txt_file.write(text)
        
        print(f"使用pdfplumber成功提取文本并保存到：{txt_path}")
        print("\n前500个字符预览：")
        print(text[:500])
        
    except Exception as e2:
        print(f"使用pdfplumber提取文本时也出错：{str(e2)}")
        print("\n请手动检查PDF文件格式，可能是扫描版PDF或加密PDF。")
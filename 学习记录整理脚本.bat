@echo off
chcp 65001 >nul

rem 设置中文显示
setlocal enabledelayedexpansion

rem 定义主目录和各子文件夹路径
set "main_dir=%~dp0"
set "word_dir=%main_dir%单词\学习记录"
set "grammar_dir=%main_dir%语法\学习记录"
set "reading_dir=%main_dir%阅读\学习记录"
set "writing_dir=%main_dir%写作\学习记录"
set "translation_dir=%main_dir%翻译\学习记录"
set "mocktest_dir=%main_dir%模拟题\学习记录"
set "textbook_dir=%main_dir%教材\学习记录"

rem 创建各子文件夹（如果不存在）
mkdir "%word_dir%" 2>nul
mkdir "%grammar_dir%" 2>nul
mkdir "%reading_dir%" 2>nul
mkdir "%writing_dir%" 2>nul
mkdir "%translation_dir%" 2>nul
mkdir "%mocktest_dir%" 2>nul
mkdir "%textbook_dir%" 2>nul

rem 开始整理文件
echo 开始整理学习记录文件...
echo.

rem 遍历主目录下的所有文件
for %%f in ("%main_dir%*.md" "%main_dir%*.txt" "%main_dir%*.pdf" "%main_dir%*.docx" "%main_dir%*.xlsx") do (
    if exist "%%f" (
        set "filename=%%~nxf"
        set "lowername=!filename!"
        set "lowername=!lowername:单词=单词!"
        set "lowername=!lowername:词汇=词汇!"
        set "lowername=!lowername:语法=语法!"
        set "lowername=!lowername:阅读=阅读!"
        set "lowername=!lowername:写作=写作!"
        set "lowername=!lowername:翻译=翻译!"
        set "lowername=!lowername:模拟题=模拟题!"
        set "lowername=!lowername:教材=教材!"

        rem 根据文件名中的关键词移动文件
        if "!lowername!" neq "!filename!" (
            if not "!lowername:单词=!" equ "!lowername!" (
                move "%%f" "%word_dir%" >nul && echo 已移动: !filename! -> 单词\学习记录
            ) else if not "!lowername:词汇=!" equ "!lowername!" (
                move "%%f" "%word_dir%" >nul && echo 已移动: !filename! -> 单词\学习记录
            ) else if not "!lowername:语法=!" equ "!lowername!" (
                move "%%f" "%grammar_dir%" >nul && echo 已移动: !filename! -> 语法\学习记录
            ) else if not "!lowername:阅读=!" equ "!lowername!" (
                move "%%f" "%reading_dir%" >nul && echo 已移动: !filename! -> 阅读\学习记录
            ) else if not "!lowername:写作=!" equ "!lowername!" (
                move "%%f" "%writing_dir%" >nul && echo 已移动: !filename! -> 写作\学习记录
            ) else if not "!lowername:翻译=!" equ "!lowername!" (
                move "%%f" "%translation_dir%" >nul && echo 已移动: !filename! -> 翻译\学习记录
            ) else if not "!lowername:模拟题=!" equ "!lowername!" (
                move "%%f" "%mocktest_dir%" >nul && echo 已移动: !filename! -> 模拟题\学习记录
            ) else if not "!lowername:教材=!" equ "!lowername!" (
                move "%%f" "%textbook_dir%" >nul && echo 已移动: !filename! -> 教材\学习记录
            )
        )
    )
)

rem 提示用户查看学习记录管理指南
echo.
echo 文件整理完成！
echo 请查看 "学习记录管理指南.md" 了解更多学习记录管理方法。
echo 按任意键退出...
pause >nul
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 开始创建种子数据...");

  // 创建示例词汇
  const vocabulary = await prisma.vocabulary.createMany({
    data: [
      {
        word: "abandon",
        pronunciation: "/əˈbændən/",
        meaning: "放弃，抛弃",
        partOfSpeech: "verb",
        difficulty: 2,
        examples: JSON.stringify([
          {
            sentence: "He had to abandon his car in the snow.",
            translation: "他不得不在雪中弃车。",
          },
          {
            sentence: "Don't abandon your dreams.",
            translation: "不要放弃你的梦想。",
          },
        ]),
      },
      {
        word: "ability",
        pronunciation: "/əˈbɪləti/",
        meaning: "能力，才能",
        partOfSpeech: "noun",
        difficulty: 1,
        examples: JSON.stringify([
          {
            sentence: "She has the ability to learn quickly.",
            translation: "她有快速学习的能力。",
          },
          {
            sentence: "His ability in mathematics is outstanding.",
            translation: "他的数学能力很出色。",
          },
        ]),
      },
      {
        word: "absolute",
        pronunciation: "/ˈæbsəluːt/",
        meaning: "绝对的，完全的",
        partOfSpeech: "adjective",
        difficulty: 3,
        examples: JSON.stringify([
          {
            sentence: "I have absolute confidence in you.",
            translation: "我对你绝对有信心。",
          },
          {
            sentence: "There is no absolute truth.",
            translation: "没有绝对的真理。",
          },
        ]),
      },
      {
        word: "academic",
        pronunciation: "/ˌækəˈdemɪk/",
        meaning: "学术的，学院的",
        partOfSpeech: "adjective",
        difficulty: 3,
        examples: JSON.stringify([
          {
            sentence: "He is an academic researcher.",
            translation: "他是一名学术研究员。",
          },
          {
            sentence: "Academic performance is important.",
            translation: "学术表现很重要。",
          },
        ]),
      },
      {
        word: "accept",
        pronunciation: "/əkˈsept/",
        meaning: "接受，承认",
        partOfSpeech: "verb",
        difficulty: 1,
        examples: JSON.stringify([
          {
            sentence: "I accept your invitation.",
            translation: "我接受你的邀请。",
          },
          {
            sentence: "Please accept my apology.",
            translation: "请接受我的道歉。",
          },
        ]),
      },
    ],
    skipDuplicates: true,
  });

  console.log(`✅ 创建了 ${vocabulary.count} 个词汇`);

  // 创建示例成就
  const achievements = await prisma.achievement.createMany({
    data: [
      {
        name: "词汇新手",
        description: "学习第一个单词",
        icon: "🎯",
        points: 10,
        category: "vocabulary",
        condition: JSON.stringify({ type: "first_word" }),
      },
      {
        name: "词汇达人",
        description: "学习100个单词",
        icon: "📚",
        points: 100,
        category: "vocabulary",
        condition: JSON.stringify({ type: "words_learned", count: 100 }),
      },
      {
        name: "语法大师",
        description: "完成所有语法练习",
        icon: "📝",
        points: 200,
        category: "grammar",
        condition: JSON.stringify({ type: "grammar_completed" }),
      },
      {
        name: "阅读专家",
        description: "完成10篇阅读理解",
        icon: "📖",
        points: 150,
        category: "reading",
        condition: JSON.stringify({ type: "reading_completed", count: 10 }),
      },
      {
        name: "写作高手",
        description: "完成5篇写作练习",
        icon: "✍️",
        points: 120,
        category: "writing",
        condition: JSON.stringify({ type: "writing_completed", count: 5 }),
      },
      {
        name: "翻译专家",
        description: "完成20个翻译练习",
        icon: "🔄",
        points: 180,
        category: "translation",
        condition: JSON.stringify({ type: "translation_completed", count: 20 }),
      },
      {
        name: "学习狂人",
        description: "连续学习7天",
        icon: "🔥",
        points: 50,
        category: "streak",
        condition: JSON.stringify({ type: "streak", days: 7 }),
      },
      {
        name: "完美主义者",
        description: "测试获得满分",
        icon: "💯",
        points: 80,
        category: "performance",
        condition: JSON.stringify({ type: "perfect_score" }),
      },
    ],
    skipDuplicates: true,
  });

  console.log(`✅ 创建了 ${achievements.count} 个成就`);

  // 创建示例语法课程
  const grammarLessons = await prisma.grammarLesson.createMany({
    data: [
      {
        title: "一般现在时",
        content: "一般现在时表示经常性、习惯性的动作或状态。",
        level: 1,
        category: "tense",
        examples: JSON.stringify([
          {
            sentence: "I work every day.",
            translation: "我每天工作。",
          },
          {
            sentence: "She likes music.",
            translation: "她喜欢音乐。",
          },
        ]),
        exercises: JSON.stringify([
          {
            question: "选择正确的动词形式：I _____ to school every day.",
            options: ["go", "goes", "going", "went"],
            answer: 0,
            explanation: "主语是I，用动词原形go",
          },
        ]),
      },
      {
        title: "一般过去时",
        content: "一般过去时表示过去某个时间发生的动作或状态。",
        level: 1,
        category: "tense",
        examples: JSON.stringify([
          {
            sentence: "I worked yesterday.",
            translation: "我昨天工作了。",
          },
          {
            sentence: "She liked the movie.",
            translation: "她喜欢那部电影。",
          },
        ]),
        exercises: JSON.stringify([
          {
            question: "选择正确的动词形式：I _____ to Beijing last year.",
            options: ["go", "goes", "went", "going"],
            answer: 2,
            explanation: "表示过去时间，用过去式went",
          },
        ]),
      },
    ],
    skipDuplicates: true,
  });

  console.log(`✅ 创建了 ${grammarLessons.count} 个语法课程`);

  // 创建示例阅读理解文章
  const readingPassages = await prisma.readingPassage.createMany({
    data: [
      {
        title: "The Importance of Learning English",
        content:
          "English is one of the most widely spoken languages in the world. It is the official language of many countries and is used in international communication, business, and education. Learning English opens up many opportunities for personal and professional growth.",
        level: 2,
        category: "education",
        wordCount: 45,
        questions: JSON.stringify([
          {
            question: "What is the main topic of this passage?",
            options: [
              "The history of English",
              "The importance of learning English",
              "English grammar rules",
              "English pronunciation",
            ],
            answer: 1,
            explanation: "文章主要讨论学习英语的重要性",
          },
        ]),
        vocabulary: JSON.stringify([
          { word: "widely", meaning: "广泛地" },
          { word: "official", meaning: "官方的" },
          { word: "international", meaning: "国际的" },
          { word: "opportunities", meaning: "机会" },
        ]),
      },
    ],
    skipDuplicates: true,
  });

  console.log(`✅ 创建了 ${readingPassages.count} 篇阅读理解文章`);

  console.log("🎉 种子数据创建完成！");
}

main()
  .catch((e) => {
    console.error("❌ 种子数据创建失败:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

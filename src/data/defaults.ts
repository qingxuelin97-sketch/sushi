import type { Party, Motion, EventTemplate, Member } from "@/types";

export const DEFAULT_PARTIES: Omit<Party, "leaderId" | "seats">[] = [
  {
    id: "conservative",
    name: "保守党",
    abbreviation: "Con",
    color: "#005EB8",
    ideology: "中右翼 · 保守主义",
    whipStrength: 88,
    isGovernment: true,
  },
  {
    id: "labour",
    name: "工党",
    abbreviation: "Lab",
    color: "#E4003B",
    ideology: "中左翼 · 社会民主主义",
    whipStrength: 85,
    isGovernment: false,
  },
  {
    id: "libdem",
    name: "自由民主党",
    abbreviation: "LD",
    color: "#FAA61A",
    ideology: "中间派 · 自由主义",
    whipStrength: 70,
    isGovernment: false,
  },
  {
    id: "snp",
    name: "苏格兰民族党",
    abbreviation: "SNP",
    color: "#FDF38E",
    ideology: "苏格兰民族主义 · 社会民主主义",
    whipStrength: 80,
    isGovernment: false,
  },
  {
    id: "green",
    name: "绿党",
    abbreviation: "Green",
    color: "#6AB023",
    ideology: "左翼 · 生态主义",
    whipStrength: 60,
    isGovernment: false,
  },
  {
    id: "reform",
    name: "改革党",
    abbreviation: "Ref",
    color: "#12B6CF",
    ideology: "右翼 · 民粹主义",
    whipStrength: 55,
    isGovernment: false,
  },
];

export const FIRST_NAMES = [
  "Arthur", "Edmund", "Hugh", "Cecil", "Reginald", "Percival", "Ambrose",
  "Thaddeus", "Benedict", "Oswald", "Winston", "Clement", "Harold", "Anthony",
  "Margaret", "Eleanor", "Beatrice", "Cordelia", "Florence", "Henrietta",
  "Agatha", "Constance", "Dorothea", "Guinevere", "Matilda", "Rosalind",
  "Alistair", "Geoffrey", "Lionel", "Marmaduke", "Neville", "Roderick",
  "Sybil", "Tabitha", "Ursula", "Victoria", "Wilhelmina", "Yseult",
  "James", "William", "Henry", "George", "Charles", "Edward", "Richard",
  "Elizabeth", "Mary", "Anne", "Catherine", "Sarah", "Emma", "Olivia",
];

export const LAST_NAMES = [
  "Blackwood", "Carmichael", "Davenport", "Ellington", "Fitzwilliam",
  "Grosvenor", "Harrington", "Inkpen", "Jellicoe", "Kingsley", "Lancaster",
  "Montague", "Northcote", "Ogilvy", "Pemberton", "Quarrell", "Rothschild",
  "Sackville", "Tavistock", "Underwood", "Vane-Tempest", "Worthington",
  "Ashworth", "Beauchamp", "Cholmondeley", "Featherstonehaugh",
  "Holland-Pinder", "Llewellyn-Evans", "Manners-Sutton", "Plantagenet",
  "Stanhope", "Villiers", "Wentworth", "Yarborough", "Zouche",
];

export const CONSTITUENCIES = [
  "Aylesbury", "Bath", "Cambridge", "Canterbury", "Cheltenham",
  "Chester", "Chichester", "Cirencester", "Derby", "Durham",
  "Exeter", "Gloucester", "Hereford", "Ipswich", "Lancaster",
  "Leicester", "Lincoln", "Norwich", "Oxford", "Plymouth",
  "Reading", "Salisbury", "Shrewsbury", "Southwark", "Taunton",
  "Winchester", "Worcester", "York", "Aberdeen", "Edinburgh Central",
  "Glasgow North", "Cardiff South", "Swansea West", "Belfast East",
  "Manchester Withington", "Birmingham Edgbaston", "Leeds West",
  "Sheffield Hallam", "Bristol West", "Nottingham East",
];

export const TRAITS = [
  "雄辩", "谨慎", "激进", "务实", "理想主义", "怀疑论者",
  "忠诚", "叛逆", "机会主义", "原则至上", "纪律严明", "独立思想",
  "善于妥协", "强硬派", "温和派", "地方主义", "欧洲怀疑论", "环保先锋",
];

export const MOTION_TEMPLATES: Omit<Motion, "id" | "proposerId" | "status" | "speeches" | "amendments" | "createdAt">[] =
  [
    {
      title: "《年度财政预算案》",
      type: "bill",
      description:
        "批准陛下政府提出的下一财政年度税收与支出计划，包括对高收入阶层加征 1% 的附加税以资助国民医疗服务体系。",
    },
    {
      title: "《教育拨款改革动议》",
      type: "motion",
      description:
        "建议将公立学校生均拨款提高 8%，并通过削减私立学校的慈善税优惠来弥补缺口。",
    },
    {
      title: "《铁路重新国有化法案》",
      type: "bill",
      description:
        "将铁路客运特许经营权在合同到期后收归国有，成立英国铁路公共管理公司。",
    },
    {
      title: "《环境税与碳边境调节机制》",
      type: "bill",
      description:
        "对高碳进口商品征收边境调节税，并将收入专项用于绿色基础设施投资。",
    },
    {
      title: "对外军事干预授权动议",
      type: "motion",
      description:
        "授权陛下政府在国际联盟框架下对某地区冲突实施有限度的空中人道主义干预。",
    },
    {
      title: "《不信任案》",
      type: "no-confidence",
      description:
        "本议院对陛下政府不再抱有信心，要求首相辞职或提请解散议会举行大选。",
    },
    {
      title: "《警察与司法拨款案》",
      type: "bill",
      description:
        "增加地方警察部队预算，扩大社区警务规模，并设立独立警察行为监督机构。",
    },
    {
      title: "《数字权利与隐私法案》",
      type: "bill",
      description:
        "限制公共机构对公民数字数据的批量收集，并要求算法决策接受独立审计。",
    },
  ];

export const EVENT_TEMPLATES: EventTemplate[] = [
  {
    id: "backbench-rebellion",
    title: "后座议员反叛",
    description:
      "政府后座议员对党鞭的指示不满，威胁在即将到来的表决中跨党投票。",
    probability: 0.18,
    impacts: [
      { targetType: "party", targetId: "conservative", delta: -10 },
      { targetType: "opinion", delta: -3 },
    ],
  },
  {
    id: "media-leak",
    title: "机密文件泄露",
    description:
      "一份标注为机密的部门备忘录被泄露给《卫报》，显示议案成本被低估。",
    probability: 0.12,
    impacts: [
      { targetType: "opinion", delta: -5 },
      { targetType: "party", targetId: "conservative", delta: -6 },
    ],
  },
  {
    id: "protest-chamber",
    title: "抗议者闯入议事厅",
    description:
      "环保抗议者从公共旁听席向议事厅内投掷粉末，议长宣布暂时休会。",
    probability: 0.06,
    impacts: [
      { targetType: "opinion", delta: -4 },
      { targetType: "party", targetId: "green", delta: 4 },
    ],
  },
  {
    id: "royal-address",
    title: "王室讲话发布",
    description:
      "国王发表御座致辞，强调国家团结，使政府支持率短期回升。",
    probability: 0.08,
    impacts: [
      { targetType: "opinion", delta: 6 },
      { targetType: "party", targetId: "conservative", delta: 3 },
    ],
  },
  {
    id: "economic-boom",
    title: "经济数据利好",
    description:
      "国家统计局公布季度 GDP 增长超预期，政府在财政议题上占据主动。",
    probability: 0.1,
    impacts: [
      { targetType: "opinion", delta: 5 },
      { targetType: "party", targetId: "conservative", delta: 4 },
    ],
  },
  {
    id: "international-crisis",
    title: "国际危机爆发",
    description:
      "海外突发外交危机，反对党呼吁暂停国内争议，支持政府采取统一立场。",
    probability: 0.07,
    impacts: [
      { targetType: "opinion", delta: 2 },
      { targetType: "party", targetId: "labour", delta: -2 },
    ],
  },
  {
    id: "scandal-resignation",
    title: "内阁大臣辞职",
    description:
      "一名内阁大臣因利益申报问题辞职，政府凝聚力受到打击。",
    probability: 0.09,
    impacts: [
      { targetType: "opinion", delta: -6 },
      { targetType: "party", targetId: "conservative", delta: -8 },
    ],
  },
  {
    id: "union-strike",
    title: "全国罢工浪潮",
    description:
      "主要工会宣布就薪酬问题举行大罢工，工党面临是否支持工友的艰难抉择。",
    probability: 0.11,
    impacts: [
      { targetType: "opinion", delta: -3 },
      { targetType: "party", targetId: "labour", delta: -5 },
    ],
  },
  {
    id: "polling-surge",
    title: "反对党民调飙升",
    description:
      "最新民调显示反对党支持率领先十二个百分点，政府后座议员人心惶惶。",
    probability: 0.13,
    impacts: [
      { targetType: "party", targetId: "labour", delta: 7 },
      { targetType: "party", targetId: "conservative", delta: -5 },
    ],
  },
  {
    id: "crossbench-deal",
    title: "跨党派协议达成",
    description:
      "两个小党发表联合声明，将在关键修正案上投赞成票以换取政策让步。",
    probability: 0.1,
    impacts: [
      { targetType: "opinion", delta: 4 },
      { targetType: "party", targetId: "libdem", delta: 3 },
    ],
  },
];

export const SPEECH_TEMPLATES: Record<string, string[]> = {
  aye: [
    "尊敬的议长先生/女士，我荣幸地支持这一议案。它将为我们国家的未来奠定坚实基础。",
    "这项措施代表了审慎的治理与对纳税人的尊重。我敦促本院予以通过。",
    "我们不能让完美的方案成为优秀的敌人。此案值得支持。",
    "我的选区选民明确告诉我，他们希望看到行动，而不是更多的空谈。",
    "这是恢复公众对议会信任的关键一步。",
  ],
  no: [
    "议长先生/女士，我必须坚决反对。这项议案缺乏充分的成本评估。",
    "政府的提案不过是权宜之计，无法解决根本问题。",
    "我的选民不会原谅我们支持一项未经深思熟虑的立法。",
    "这是错误的方向，将使最脆弱的群体承受最大代价。",
    "我们被要求盲目信任行政部门，而这不是议会的职责。",
  ],
  abstain: [
    "我承认议案中有值得肯定的元素，但我的保留意见使我无法投下赞成票。",
    "在没有看到完整影响评估之前，我选择弃权。",
    "我的良心不允许我支持当前文本，但我也不会加入反对阵营。",
  ],
};

export const RULING_TEMPLATES = [
  "议长：秩序！秩序！请继续发言。",
  "议长：本席裁定该程序问题成立。",
  "议长：请遵守议事规则，不要使用不恭之辞。",
  "议长：本院现在进入下一个议程项目。",
  "议长：请撤回该言词，否则本席将要求你离席。",
];

export const RULES = [
  {
    id: "standing-order-1",
    title: "议长权威",
    content: "议长负责维持下议院秩序，解释议事规则，并决定发言顺序。",
    example: "当两名议员同时起立时，议长将点名其中一人发言。",
    terms: ["议长（Speaker）", "议事规则（Standing Orders）"],
  },
  {
    id: "standing-order-9",
    title: " quorum（法定人数）",
    content: "下议院进行一般事务辩论时至少需要 40 名议员出席，其中包含议长或副议长。",
    example: "若不足法定人数，议院将敲响钟声召集议员。",
    terms: ["法定人数（Quorum）", "分铃（Division Bell）"],
  },
  {
    id: "standing-order-24",
    title: "首相质询时间",
    content: "每周三中午，首相将就预先提交的问题接受议员质询。",
    example: "后座议员可就选区事务向首相提问。",
    terms: ["首相质询（PMQs）", "后座议员（Backbencher）"],
  },
  {
    id: "point-of-order",
    title: "程序问题",
    content: "议员可打断辩论，就程序是否合规向议长提出质疑。",
    example: "‘议长先生，程序问题：该修正案是否超出议案范围？’",
    terms: ["程序问题（Point of Order）", "范围（Scope）"],
  },
  {
    id: "division",
    title: "分组表决",
    content: "表决时议员分别进入 Aye（赞成）或 No（反对）走廊，由计票员清点人数。",
    example: "议长宣布‘清场表决’后，各门开启两分钟供议员进出。",
    terms: ["分组表决（Division）", "计票员（Teller）"],
  },
  {
    id: "whip",
    title: "党鞭",
    content: "党鞭负责确保本党议员按党的立场投票，强度从一鞭（建议）到三鞭（强制）不等。",
    example: "违反三鞭指示的议员可能失去党鞭资格并被开除出党。",
    terms: ["党鞭（Whip）", "失去党鞭（Lose the Whip）"],
  },
  {
    id: "amendment",
    title: "修正案",
    content: "修正案用于修改母案文本，通常须符合议案范围并通过表决。",
    example: "议员可提出删除某条款或增加新条款的修正案。",
    terms: ["修正案（Amendment）", "母案（Bill）"],
  },
  {
    id: "hansard",
    title: "汉萨德议事录",
    content: "官方逐字记录下议院辩论、书面问题与表决结果。",
    example: "议员可在次日更正自己的发言记录，但不得改变实质内容。",
    terms: ["汉萨德（Hansard）", "逐字记录（Verbatim）"],
  },
  {
    id: "order-paper",
    title: "议程文件",
    content: "每日议程文件列明当天将讨论的议题、法案与问题。",
    example: "议长按议程文件顺序传唤议员。",
    terms: ["议程文件（Order Paper）", "议事日程（Business）"],
  },
  {
    id: "early-day-motion",
    title: "早期动议",
    content: "早期动议是一种不强制表决的请愿式动议，用于表达议院意见。",
    example: "议员可就某项政策发起早期动议征集连署。",
    terms: ["早期动议（Early Day Motion）", "连署（Signatory）"],
  },
];

export const IDEOLOGIES = [
  "自由主义",
  "保守主义",
  "社会民主主义",
  "生态主义",
  "民族主义",
  "民粹主义",
  "基督教民主主义",
  "自由意志主义",
];

export function generateDicebearAvatar(seed: string): string {
  return `https://api.dicebear.com/9.x/notionists/svg?seed=${encodeURIComponent(
    seed
  )}&backgroundColor=e6dfce`;
}

export function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function randomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function generateMemberName(): string {
  const first = randomItem(FIRST_NAMES);
  const last = randomItem(LAST_NAMES);
  return `${first} ${last}`;
}

export function generateConstituency(): string {
  return randomItem(CONSTITUENCIES);
}

export function generateTraits(count = 2): string[] {
  const shuffled = [...TRAITS].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

export function generateMember(partyId: string, index: number): Member {
  const name = generateMemberName();
  return {
    id: `m-${Date.now()}-${index}`,
    name,
    constituency: generateConstituency(),
    partyId,
    avatar: generateDicebearAvatar(name),
    eloquence: randomInt(30, 95),
    loyalty: randomInt(40, 95),
    attendance: randomInt(60, 98),
    isPresent: Math.random() > 0.08,
    isRebel: false,
    traits: generateTraits(),
  };
}

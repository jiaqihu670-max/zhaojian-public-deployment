// _server-entry.ts
import "dotenv/config";
import { join as join2, resolve as resolve2 } from "node:path";
import express2 from "express";

// ../黑客松/server/app.ts
import { randomBytes } from "node:crypto";
import { mkdir, readdir, rm, unlink, writeFile } from "node:fs/promises";
import { join, resolve } from "node:path";
import express from "express";
import multer from "multer";
import OpenAI from "openai";

// ../黑客松/src/oracle/traditionalContent.ts
var baseFigures = [
  ["cai-yuanpei", "\u8521\u5143\u57F9", "\u4E2D\u56FD", "https://commons.wikimedia.org/wiki/Category:Cai_Yuanpei", "\u5728\u65E2\u6709\u5236\u5EA6\u4E2D\u63A8\u52A8\u6559\u80B2\u4E0E\u5B66\u672F\u8F6C\u5411"],
  ["lin-huiyin", "\u6797\u5FBD\u56E0", "\u4E2D\u56FD", "https://commons.wikimedia.org/wiki/Category:Lin_Huiyin", "\u5728\u5EFA\u7B51\u3001\u5199\u4F5C\u4E0E\u6587\u5316\u4FDD\u5B58\u4E4B\u95F4\u6301\u7EED\u9009\u62E9"],
  ["lu-xun", "\u9C81\u8FC5", "\u4E2D\u56FD", "https://commons.wikimedia.org/wiki/Category:Lu_Xun", "\u7531\u533B\u5B66\u8F6C\u5411\u6587\u5B66\uFF0C\u4EE5\u5199\u4F5C\u56DE\u5E94\u65F6\u4EE3"],
  ["qian-xuesen", "\u94B1\u5B66\u68EE", "\u4E2D\u56FD", "https://commons.wikimedia.org/wiki/Category:Qian_Xuesen", "\u5728\u590D\u6742\u5904\u5883\u4E2D\u9009\u62E9\u56DE\u56FD\u53C2\u4E0E\u79D1\u5B66\u5EFA\u8BBE"],
  ["soong-ching-ling", "\u5B8B\u5E86\u9F84", "\u4E2D\u56FD", "https://commons.wikimedia.org/wiki/Category:Soong_Ching-ling", "\u5728\u5386\u53F2\u5206\u6B67\u4E2D\u575A\u6301\u5176\u516C\u5171\u5173\u6000"],
  ["mei-lanfang", "\u6885\u5170\u82B3", "\u4E2D\u56FD", "https://commons.wikimedia.org/wiki/Category:Mei_Lanfang", "\u5728\u4F20\u7EDF\u821E\u53F0\u4E2D\u4E0D\u65AD\u91CD\u5851\u8868\u6F14\u8BED\u8A00"],
  ["chiang-yee", "\u848B\u5F5D", "\u4E2D\u56FD", "https://commons.wikimedia.org/wiki/Category:Chiang_Yee", "\u4EE5\u8DE8\u6587\u5316\u5199\u4F5C\u91CD\u65B0\u89C2\u770B\u6545\u4E61\u4E0E\u4E16\u754C"],
  ["wu-jianxiong", "\u5434\u5065\u96C4", "\u4E2D\u56FD", "https://commons.wikimedia.org/wiki/Category:Chien-Shiung_Wu", "\u5728\u5B9E\u9A8C\u7269\u7406\u4E2D\u9009\u62E9\u4EE5\u7CBE\u786E\u6311\u6218\u65E2\u6709\u5047\u8BBE"],
  ["feng-zikai", "\u4E30\u5B50\u607A", "\u4E2D\u56FD", "https://commons.wikimedia.org/wiki/Category:Feng_Zikai", "\u4EE5\u514B\u5236\u7684\u56FE\u6587\u8BED\u8A00\u4FDD\u5B58\u65E5\u5E38\u611F\u53D7"],
  ["zhu-zaiyu", "\u6731\u8F7D\u5809", "\u4E2D\u56FD", "https://commons.wikimedia.org/wiki/Category:Zhu_Zaiyu", "\u5728\u793C\u4E50\u4F20\u7EDF\u4E2D\u4EE5\u8BA1\u7B97\u6253\u5F00\u65B0\u7684\u97F3\u5F8B\u7406\u89E3"],
  ["shenzhou", "\u6C88\u5468", "\u4E2D\u56FD", "https://commons.wikimedia.org/wiki/Category:Shen_Zhou", "\u9009\u62E9\u5728\u81EA\u6211\u8282\u5F8B\u4E2D\u5EFA\u7ACB\u7ED8\u753B\u4E0E\u4EA4\u6E38"],
  ["zhang-heng", "\u5F20\u8861", "\u4E2D\u56FD", "https://commons.wikimedia.org/wiki/Category:Zhang_Heng", "\u8BA9\u6587\u5B66\u60F3\u8C61\u4E0E\u5929\u6587\u5668\u68B0\u5F7C\u6B64\u7167\u89C1"],
  ["ada-lovelace", "\u57C3\u8FBE\xB7\u6D1B\u592B\u83B1\u65AF", "\u4E16\u754C", "https://commons.wikimedia.org/wiki/Category:Ada_Lovelace", "\u770B\u89C1\u8BA1\u7B97\u673A\u5668\u4E0D\u53EA\u5904\u7406\u6570\u5B57\u7684\u53EF\u80FD"],
  ["marie-curie", "\u739B\u4E3D\xB7\u5C45\u91CC", "\u4E16\u754C", "https://commons.wikimedia.org/wiki/Category:Marie_Curie", "\u5728\u53D7\u9650\u73AF\u5883\u4E2D\u6301\u7EED\u9009\u62E9\u5B9E\u9A8C\u4E0E\u516C\u5F00\u77E5\u8BC6"],
  ["rabindranath-tagore", "\u6CF0\u6208\u5C14", "\u4E16\u754C", "https://commons.wikimedia.org/wiki/Category:Rabindranath_Tagore", "\u5728\u8BD7\u6B4C\u3001\u6559\u80B2\u4E0E\u8DE8\u6587\u5316\u5BF9\u8BDD\u4E4B\u95F4\u5F80\u8FD4"],
  ["alan-turing", "\u827E\u4F26\xB7\u56FE\u7075", "\u4E16\u754C", "https://commons.wikimedia.org/wiki/Category:Alan_Turing", "\u4EE5\u5F62\u5F0F\u5316\u95EE\u9898\u91CD\u65B0\u8FFD\u95EE\u673A\u5668\u4E0E\u601D\u7EF4"],
  ["frida-kahlo", "\u5F17\u91CC\u8FBE\xB7\u5361\u7F57", "\u4E16\u754C", "https://commons.wikimedia.org/wiki/Category:Frida_Kahlo", "\u628A\u8EAB\u4F53\u7ECF\u9A8C\u8F6C\u5316\u4E3A\u4E0D\u88AB\u5355\u4E00\u5B9A\u4E49\u7684\u81EA\u753B\u50CF"],
  ["james-baldwin", "\u8A79\u59C6\u65AF\xB7\u9C8D\u5FB7\u6E29", "\u4E16\u754C", "https://commons.wikimedia.org/wiki/Category:James_Baldwin", "\u4EE5\u5199\u4F5C\u76F4\u9762\u8EAB\u4EFD\u3001\u793E\u4F1A\u4E0E\u81EA\u7531\u7684\u5F20\u529B"],
  ["virginia-woolf", "\u5F17\u5409\u5C3C\u4E9A\xB7\u4F0D\u5C14\u592B", "\u4E16\u754C", "https://commons.wikimedia.org/wiki/Category:Virginia_Woolf", "\u5B9E\u9A8C\u65B0\u7684\u53D9\u4E8B\u5F62\u5F0F\u6765\u5BB9\u7EB3\u610F\u8BC6\u6D41\u52A8"],
  ["leonardo", "\u8FBE\xB7\u82AC\u5947", "\u4E16\u754C", "https://commons.wikimedia.org/wiki/Category:Leonardo_da_Vinci", "\u8BA9\u827A\u672F\u89C2\u5BDF\u4E0E\u5DE5\u7A0B\u95EE\u9898\u6301\u7EED\u4E92\u76F8\u6539\u5199"],
  ["katherine-johnson", "\u51EF\u745F\u7433\xB7\u7EA6\u7FF0\u900A", "\u4E16\u754C", "https://commons.wikimedia.org/wiki/Category:Katherine_Johnson", "\u4EE5\u8BA1\u7B97\u7CBE\u5EA6\u7A7F\u8FC7\u5236\u5EA6\u9650\u5236\u53C2\u4E0E\u592A\u7A7A\u63A2\u7D22"],
  ["charles-darwin", "\u67E5\u5C14\u65AF\xB7\u8FBE\u5C14\u6587", "\u4E16\u754C", "https://commons.wikimedia.org/wiki/Category:Charles_Darwin", "\u957F\u671F\u4FDD\u7559\u7591\u95EE\uFF0C\u518D\u8BA9\u8BC1\u636E\u6539\u53D8\u89E3\u91CA\u6846\u67B6"],
  ["helen-keller", "\u6D77\u4F26\xB7\u51EF\u52D2", "\u4E16\u754C", "https://commons.wikimedia.org/wiki/Category:Helen_Keller", "\u628A\u4E2A\u4EBA\u7ECF\u9A8C\u8F6C\u5411\u6559\u80B2\u4E0E\u516C\u5171\u884C\u52A8"],
  ["srinivasa-ramanujan", "\u62C9\u9A6C\u52AA\u91D1", "\u4E16\u754C", "https://commons.wikimedia.org/wiki/Category:Srinivasa_Ramanujan", "\u5728\u6709\u9650\u8D44\u6E90\u4E2D\u6301\u7EED\u8FFD\u7D22\u6570\u5B66\u5F62\u5F0F"]
];
var figureEchoes = baseFigures.map(([id, name, region, sourceUrl, pivotalChoice]) => ({
  id,
  name,
  region,
  deceased: true,
  sourceUrl,
  visualEcho: ["\u6B63\u9762\u8096\u50CF\u4E2D\u7684\u8F6E\u5ED3\u8282\u594F", "\u7709\u773C\u4E0E\u9762\u90E8\u7559\u767D\u7684\u89C6\u89C9\u5173\u7CFB"],
  pivotalChoice,
  reflection: `\u8FD9\u4E0D\u662F\u8EAB\u4EFD\u5339\u914D\u3002\u5B83\u53EA\u628A\u4E00\u7EC4\u53EF\u89C1\u5F62\u5F0F\uFF0C\u8FDE\u63A5\u5230${name}\u66FE\u7ECF\u505A\u8FC7\u7684\u4E00\u4E2A\u9009\u62E9\u3002`,
  confidence: 0.58,
  limitations: ["\u6709\u9650\u8096\u50CF\u5E93\u4E2D\u7684\u827A\u672F\u5316\u89C6\u89C9\u56DE\u58F0\uFF0C\u4E0D\u4EE3\u8868\u76F8\u4F3C\u8EAB\u4EFD\u3001\u4EBA\u683C\u6216\u547D\u8FD0\u3002"],
  sourceKind: "curated"
}));
var forbiddenClaims = [
  "\u547D\u4E2D\u6CE8\u5B9A",
  "\u5927\u5BCC\u5927\u8D35",
  "\u5FC5\u7136",
  "\u4E00\u5B9A\u4F1A",
  "\u4F60\u5C06",
  "\u6CE8\u5B9A",
  "\u514B\u592B",
  "\u65FA\u592B",
  "\u77ED\u547D",
  "\u957F\u5BFF",
  "\u75BE\u75C5",
  "\u53D1\u8D22",
  "\u5A5A\u59FB\u4E0D\u987A",
  "\u6027\u683C\u5C31\u662F"
];
function validateReflectionText(text) {
  return forbiddenClaims.filter((claim) => text.includes(claim));
}

// ../黑客松/server/schemas.ts
import { z } from "zod";
var reflectiveBranchSchema = z.object({
  premise: z.string().min(8).max(180),
  possibility: z.string().min(12).max(240),
  cost: z.string().min(12).max(240),
  question: z.string().min(8).max(180)
}).strict();
var visualSummarySchema = z.object({
  faceWidthRatio: z.number().min(0).max(1),
  faceHeightRatio: z.number().min(0).max(1),
  landmarkCount: z.number().int().min(0).max(1e3),
  particleLuminance: z.number().min(0).max(255)
}).strict();
var portraitModelSchema = z.object({
  figureId: z.string().min(1).max(80),
  visualEcho: z.array(z.string().min(4).max(100)).min(1).max(3),
  reflection: z.string().min(12).max(260)
}).strict();
var narrativeRequestSchema = z.object({
  answers: z.object({
    state: z.enum(["staying", "exploring", "turning"]),
    action: z.enum(["waiting", "testing", "advancing"]),
    change: z.enum(["rhythm", "direction", "distance"])
  }).strict(),
  symbols: z.object({
    hexagram: z.string().max(24).optional(),
    phase: z.string().max(24).optional(),
    realm: z.string().max(24).optional(),
    palmMode: z.enum(["texture", "skeleton"]).optional(),
    figureChoice: z.string().max(160).optional()
  }).strict(),
  context: z.string().max(300).optional()
}).strict();
var narrativeResponseSchema = z.object({
  maybeSo: reflectiveBranchSchema,
  maybeNot: reflectiveBranchSchema
}).strict();
var deepSeekEvidenceSchema = z.object({
  id: z.string().min(1).max(80),
  domain: z.enum(["birth-structure", "face-framework", "palm-framework", "modern-observation", "user-selection"]),
  observation: z.string().min(2).max(240),
  sourceKind: z.enum(["calculated", "curated", "visible-action", "user-selected", "ritual"])
}).strict();
var deepSeekSourceSchema = z.object({
  id: z.string().min(1).max(80),
  title: z.string().min(2).max(120),
  section: z.string().min(1).max(120),
  excerpt: z.string().min(4).max(1200)
}).strict();
var deepSeekReadingRequestSchema = z.object({
  evidence: z.array(deepSeekEvidenceSchema).min(1).max(24),
  sources: z.array(deepSeekSourceSchema).min(1).max(12),
  selectedStatementIds: z.array(z.string().min(1).max(80)).max(8)
}).strict();
var deepSeekStatementSchema = z.object({
  id: z.string().min(1).max(80),
  text: z.string().min(8).max(180).regex(/^你/),
  interpretationType: z.enum(["cultural-metaphor", "observable-summary", "user-reflection"]),
  sourceIds: z.array(z.string().min(1).max(80)).min(1).max(3),
  reasoning: z.string().min(8).max(260),
  caveat: z.string().min(8).max(160)
}).strict();
var deepSeekReadingModelSchema = z.object({
  statements: z.array(deepSeekStatementSchema).min(1).max(12),
  unsupported: z.array(z.string().min(2).max(160)).max(12)
}).strict();
var modernEvidenceSchema = z.object({
  id: z.string().min(1).max(80),
  label: z.string().min(2).max(240),
  value: z.union([z.number().finite(), z.string().min(1).max(120)])
}).strict();
var modernSelectedStatementSchema = z.object({
  id: z.string().min(1).max(80),
  text: z.string().min(4).max(180)
}).strict();
var modernSourceSchema = z.object({
  id: z.string().min(1).max(80),
  title: z.string().min(2).max(160),
  excerpt: z.string().min(8).max(1200)
}).strict();
var modernReadingRequestSchema = z.object({
  evidence: z.array(modernEvidenceSchema).min(1).max(16),
  selectedStatements: z.array(modernSelectedStatementSchema).max(8),
  sources: z.array(modernSourceSchema).min(1).max(8)
}).strict();
var modernReadingStatementSchema = z.object({
  id: z.string().min(1).max(80),
  text: z.string().min(8).max(180).regex(/^你/),
  evidenceIds: z.array(z.string().min(1).max(80)).min(1).max(4),
  sourceIds: z.array(z.string().min(1).max(80)).min(1).max(3),
  reasoning: z.string().min(8).max(260),
  caveat: z.string().min(8).max(180)
}).strict();
var modernReadingModelSchema = z.object({
  statements: z.array(modernReadingStatementSchema).min(1).max(12)
}).strict();
var guardianSelectedStatementSchema = z.object({
  id: z.string().min(1).max(80),
  text: z.string().min(4).max(180),
  mode: z.enum(["traditional", "modern"])
}).strict();
var guardianMatchRequestSchema = z.object({
  selectedStatements: z.array(guardianSelectedStatementSchema).min(1).max(8),
  mainStarId: z.string().min(1).max(40).optional()
}).strict();
var guardianMatchModelSchema = z.object({
  mainStarId: z.string().min(1).max(40),
  mansionId: z.string().min(1).max(60),
  reasoning: z.string().min(8).max(220)
}).strict();
var guardianDialogueRequestSchema = z.object({
  mainStarId: z.string().min(1).max(40),
  mansionId: z.string().min(1).max(60),
  question: z.string().trim().min(2).max(160),
  selectedStatements: z.array(guardianSelectedStatementSchema).max(4)
}).strict();
var guardianDialogueModelSchema = z.object({
  answer: z.string().trim().min(12).max(280)
}).strict();
var archiveRequestSchema = z.object({
  consent: z.literal(true),
  consentVersion: z.string().min(4).max(40),
  artworkPng: z.string().max(16e6).regex(/^data:image\/png;base64,/)
}).strict();
var portraitJsonSchema = {
  type: "object",
  additionalProperties: false,
  required: ["figureId", "visualEcho", "reflection"],
  properties: {
    figureId: { type: "string" },
    visualEcho: { type: "array", minItems: 1, maxItems: 3, items: { type: "string" } },
    reflection: { type: "string" }
  }
};
var narrativeJsonSchema = {
  type: "object",
  additionalProperties: false,
  required: ["maybeSo", "maybeNot"],
  properties: {
    maybeSo: {
      type: "object",
      additionalProperties: false,
      required: ["premise", "possibility", "cost", "question"],
      properties: {
        premise: { type: "string" },
        possibility: { type: "string" },
        cost: { type: "string" },
        question: { type: "string" }
      }
    },
    maybeNot: {
      type: "object",
      additionalProperties: false,
      required: ["premise", "possibility", "cost", "question"],
      properties: {
        premise: { type: "string" },
        possibility: { type: "string" },
        cost: { type: "string" },
        question: { type: "string" }
      }
    }
  }
};

// ../黑客松/src/data/starMansions.ts
var starMansions = [
  { id: "jiao-mu-jiao", name: "\u89D2\u6728\u86DF", animal: "\u86DF", element: "\u6728", quadrant: "\u4E1C\u65B9\u82CD\u9F99", order: 1, line: "\u9752\u89D2\u521D\u5F20\uFF0C\u4E07\u7269\u6709\u4E86\u5411\u4E0A\u7684\u8F6E\u5ED3\u3002", note: "\u4EE5\u8BD5\u63A2\u7684\u529B\u5EA6\uFF0C\u6253\u5F00\u7B2C\u4E00\u9053\u7F1D\u9699\u3002", color: "#39a882" },
  { id: "kang-jin-long", name: "\u4EA2\u91D1\u9F99", animal: "\u9F99", element: "\u91D1", quadrant: "\u4E1C\u65B9\u82CD\u9F99", order: 2, line: "\u9F99\u810A\u9AD8\u4EA2\uFF0C\u5B88\u4F4F\u4E0D\u5FC5\u89E3\u91CA\u7684\u5C3A\u5EA6\u3002", note: "\u62AC\u5934\uFF0C\u4F46\u4E0D\u628A\u950B\u8292\u4EA4\u7ED9\u55A7\u54D7\u3002", color: "#d7ad6f" },
  { id: "di-tu-he", name: "\u6C10\u571F\u8C89", animal: "\u8C89", element: "\u571F", quadrant: "\u4E1C\u65B9\u82CD\u9F99", order: 3, line: "\u4F0F\u5730\u542C\u98CE\uFF0C\u77E5\u9053\u6839\u4ECE\u54EA\u91CC\u751F\u957F\u3002", note: "\u5148\u5B89\u653E\u811A\u4E0B\uFF0C\u518D\u9009\u62E9\u8FDC\u65B9\u3002", color: "#c98055" },
  { id: "fang-ri-tu", name: "\u623F\u65E5\u5154", animal: "\u5154", element: "\u65E5", quadrant: "\u4E1C\u65B9\u82CD\u9F99", order: 4, line: "\u65E5\u5149\u5165\u623F\uFF0C\u5FAE\u5C0F\u7684\u4E8B\u7269\u5F00\u59CB\u663E\u5F62\u3002", note: "\u628A\u6CE8\u610F\u529B\u7559\u7ED9\u6B63\u5728\u53D1\u751F\u7684\u7EC6\u8282\u3002", color: "#e99a4d" },
  { id: "xin-yue-hu", name: "\u5FC3\u6708\u72D0", animal: "\u72D0", element: "\u6708", quadrant: "\u4E1C\u65B9\u82CD\u9F99", order: 5, line: "\u6708\u8272\u85CF\u5FC3\uFF0C\u654F\u9510\u5E76\u4E0D\u9700\u8981\u58F0\u5F20\u3002", note: "\u76F8\u4FE1\u4F60\u7684\u8FA8\u522B\uFF0C\u4E5F\u5141\u8BB8\u5B83\u6162\u4E00\u70B9\u3002", color: "#d86884" },
  { id: "wei-huo-hu", name: "\u5C3E\u706B\u864E", animal: "\u864E", element: "\u706B", quadrant: "\u4E1C\u65B9\u82CD\u9F99", order: 6, line: "\u706B\u5728\u5C3E\u7AEF\u56DE\u671B\uFF0C\u529B\u91CF\u5B66\u4F1A\u6536\u675F\u3002", note: "\u628A\u51B2\u52A8\u70BC\u6210\u4E00\u6B21\u660E\u786E\u7684\u884C\u52A8\u3002", color: "#ef5a2b" },
  { id: "ji-shui-bao", name: "\u7B95\u6C34\u8C79", animal: "\u8C79", element: "\u6C34", quadrant: "\u4E1C\u65B9\u82CD\u9F99", order: 7, line: "\u6C34\u7EB9\u7A7F\u8FC7\u8C79\u5F71\uFF0C\u53D8\u5316\u5E76\u975E\u5931\u5E8F\u3002", note: "\u7559\u4E0B\u56DE\u65CB\u7684\u4F59\u5730\uFF0C\u8DEF\u4F1A\u81EA\u5DF1\u5C55\u5F00\u3002", color: "#4b9eae" },
  { id: "dou-mu-xie", name: "\u6597\u6728\u736C", animal: "\u736C", element: "\u6728", quadrant: "\u5317\u65B9\u7384\u6B66", order: 1, line: "\u6597\u67C4\u6307\u5317\uFF0C\u5224\u65AD\u5728\u6697\u5904\u6162\u6162\u6E05\u695A\u3002", note: "\u5148\u8FA8\u65B9\u5411\uFF0C\u518D\u8C08\u62B5\u8FBE\u3002", image: "/stars/dou-mu-xie.jpg", color: "#62b9a0" },
  { id: "niu-jin-niu", name: "\u725B\u91D1\u725B", animal: "\u725B", element: "\u91D1", quadrant: "\u5317\u65B9\u7384\u6B66", order: 2, line: "\u91D1\u725B\u8D1F\u91CD\uFF0C\u628A\u6F2B\u957F\u53D8\u6210\u53EF\u9760\u3002", note: "\u4ECA\u5929\u7684\u91CD\u590D\uFF0C\u4E5F\u5728\u6784\u7B51\u4F60\u7684\u5730\u5E73\u7EBF\u3002", image: "/stars/niu-jin-niu.jpg", color: "#d9bd5a" },
  { id: "nv-tu-fu", name: "\u5973\u571F\u8760", animal: "\u8760", element: "\u571F", quadrant: "\u5317\u65B9\u7384\u6B66", order: 3, line: "\u8760\u7FFC\u88C1\u591C\uFF0C\u9759\u5904\u81EA\u6709\u56DE\u58F0\u3002", note: "\u4E0D\u5FC5\u6025\u7740\u56DE\u7B54\uFF0C\u5148\u542C\u89C1\u81EA\u5DF1\u7684\u58F0\u97F3\u3002", image: "/stars/nv-tu-fu.jpg", color: "#e38096" },
  { id: "xu-ri-shu", name: "\u865A\u65E5\u9F20", animal: "\u9F20", element: "\u65E5", quadrant: "\u5317\u65B9\u7384\u6B66", order: 4, line: "\u865A\u5BA4\u7EB3\u5149\uFF0C\u7559\u767D\u4E0D\u662F\u7A7A\u7F3A\u3002", note: "\u4E3A\u672A\u53D1\u751F\u7684\u4E8B\uFF0C\u7559\u4E00\u6247\u5C0F\u7A97\u3002", image: "/stars/xu-ri-shu.jpg", color: "#c25984" },
  { id: "wei-yue-yan", name: "\u5371\u6708\u71D5", animal: "\u71D5", element: "\u6708", quadrant: "\u5317\u65B9\u7384\u6B66", order: 5, line: "\u5371\u697C\u6708\u71D5\uFF0C\u8F7B\u8EAB\u8D8A\u8FC7\u60AC\u5904\u3002", note: "\u5728\u4E0D\u786E\u5B9A\u91CC\uFF0C\u4ECD\u53EF\u627E\u5230\u843D\u70B9\u3002", image: "/stars/wei-yue-yan.jpg", color: "#df6f8b" },
  { id: "shi-huo-zhu", name: "\u5BA4\u706B\u732A", animal: "\u732A", element: "\u706B", quadrant: "\u5317\u65B9\u7384\u6B66", order: 6, line: "\u5BA4\u4E2D\u6709\u706B\uFF0C\u5B88\u62A4\u4E5F\u80FD\u662F\u6E29\u70ED\u7684\u3002", note: "\u7167\u6599\u5177\u4F53\u7684\u4EBA\u548C\u5177\u4F53\u7684\u751F\u6D3B\u3002", image: "/stars/shi-huo-zhu.jpg", color: "#efb252" },
  { id: "bi-shui-yu", name: "\u58C1\u6C34\u8C90", animal: "\u8C90", element: "\u6C34", quadrant: "\u5317\u65B9\u7384\u6B66", order: 7, line: "\u6C34\u6CBF\u7740\u58C1\u884C\uFF0C\u8FB9\u754C\u8BA9\u6D41\u52A8\u53EF\u89C1\u3002", note: "\u7ED9\u5173\u7CFB\u4E00\u4E2A\u6E05\u6670\u800C\u67D4\u8F6F\u7684\u8FB9\u7F18\u3002", image: "/stars/bi-shui-yu.jpg", color: "#eb8c58" },
  { id: "kui-mu-lang", name: "\u594E\u6728\u72FC", animal: "\u72FC", element: "\u6728", quadrant: "\u897F\u65B9\u767D\u864E", order: 1, line: "\u594E\u6728\u6210\u6587\uFF0C\u5B64\u884C\u4E5F\u6709\u81EA\u5DF1\u7684\u8282\u62CD\u3002", note: "\u628A\u72EC\u5904\u53D8\u6210\u6301\u7EED\u751F\u957F\u7684\u7A7A\u95F4\u3002", color: "#6fb17b" },
  { id: "lou-jin-gou", name: "\u5A04\u91D1\u72D7", animal: "\u72D7", element: "\u91D1", quadrant: "\u897F\u65B9\u767D\u864E", order: 2, line: "\u91D1\u58F0\u5728\u5A04\uFF0C\u5FE0\u8BDA\u662F\u4E00\u79CD\u9009\u62E9\u3002", note: "\u770B\u6E05\u4F60\u613F\u610F\u957F\u671F\u5B88\u4F4F\u7684\u4E8B\u3002", color: "#dd9c55" },
  { id: "wei-tu-zhi", name: "\u80C3\u571F\u96C9", animal: "\u96C9", element: "\u571F", quadrant: "\u897F\u65B9\u767D\u864E", order: 3, line: "\u96C9\u7FBD\u843D\u571F\uFF0C\u5BFB\u5E38\u4E5F\u80FD\u6210\u4E3A\u79E9\u5E8F\u3002", note: "\u8BA9\u8EAB\u4F53\u5148\u56DE\u5230\u53EF\u627F\u53D7\u7684\u8282\u594F\u3002", color: "#b9694b" },
  { id: "mao-ri-ji", name: "\u6634\u65E5\u9E21", animal: "\u9E21", element: "\u65E5", quadrant: "\u897F\u65B9\u767D\u864E", order: 4, line: "\u6634\u661F\u62A5\u6653\uFF0C\u9192\u6765\u5C31\u5DF2\u662F\u56DE\u7B54\u3002", note: "\u628A\u7B2C\u4E00\u6B65\u653E\u5728\u4ECA\u5929\uFF0C\u800C\u975E\u60F3\u8C61\u91CC\u3002", color: "#f0b947" },
  { id: "bi-yue-wu", name: "\u6BD5\u6708\u4E4C", animal: "\u4E4C", element: "\u6708", quadrant: "\u897F\u65B9\u767D\u864E", order: 5, line: "\u4E4C\u63A0\u6708\u91CE\uFF0C\u6C89\u9759\u91CC\u6709\u5F88\u8FDC\u7684\u76EE\u5149\u3002", note: "\u4E0D\u6025\u4E8E\u7ED3\u8BBA\uFF0C\u8BA9\u89C2\u5BDF\u518D\u505C\u7559\u4E00\u4F1A\u3002", color: "#6d73a8" },
  { id: "zi-huo-hou", name: "\u89DC\u706B\u7334", animal: "\u7334", element: "\u706B", quadrant: "\u897F\u65B9\u767D\u864E", order: 6, line: "\u706B\u8DC3\u89DC\u7AEF\uFF0C\u7075\u5DE7\u4E0D\u662F\u8F7B\u6D6E\u3002", note: "\u628A\u597D\u5947\u5FC3\u7528\u5728\u4E00\u4EF6\u771F\u6B63\u60F3\u61C2\u7684\u4E8B\u4E0A\u3002", image: "/stars/zi-huo-hou.jpg", color: "#f1c83f" },
  { id: "shen-shui-yuan", name: "\u53C2\u6C34\u733F", animal: "\u733F", element: "\u6C34", quadrant: "\u897F\u65B9\u767D\u864E", order: 7, line: "\u733F\u5F71\u5165\u6C34\uFF0C\u8FDC\u8FD1\u5728\u4E00\u77AC\u5012\u7F6E\u3002", note: "\u6362\u4E00\u4E2A\u89D2\u5EA6\uFF0C\u56F0\u4F4F\u4F60\u7684\u4E1C\u897F\u4F1A\u677E\u5F00\u3002", image: "/stars/shen-shui-yuan.jpg", color: "#3ca9a2" },
  { id: "jing-mu-an", name: "\u4E95\u6728\u72B4", animal: "\u72B4", element: "\u6728", quadrant: "\u5357\u65B9\u6731\u96C0", order: 1, line: "\u4E95\u53E3\u89C1\u5929\uFF0C\u5411\u4E0B\u4E5F\u80FD\u901A\u5F80\u8FBD\u9614\u3002", note: "\u56DE\u5230\u6E90\u5934\uFF0C\u628A\u529B\u91CF\u91CD\u65B0\u6C72\u8D77\u3002", image: "/stars/jing-mu-an.jpg", color: "#3cae93" },
  { id: "gui-jin-yang", name: "\u9B3C\u91D1\u7F8A", animal: "\u7F8A", element: "\u91D1", quadrant: "\u5357\u65B9\u6731\u96C0", order: 2, line: "\u91D1\u7F8A\u8FC7\u91CE\uFF0C\u6E29\u548C\u5E76\u975E\u6CA1\u6709\u91CD\u91CF\u3002", note: "\u628A\u4F60\u7684\u575A\u6301\u8BF4\u5F97\u66F4\u8F7B\u4E00\u70B9\u3002", image: "/stars/gui-jin-yang.jpg", color: "#d96d82" },
  { id: "liu-tu-zhang", name: "\u67F3\u571F\u7350", animal: "\u7350", element: "\u571F", quadrant: "\u5357\u65B9\u6731\u96C0", order: 3, line: "\u67F3\u5F71\u4F0F\u5730\uFF0C\u67D4\u8F6F\u4E5F\u4F1A\u8BB0\u5F97\u6839\u7CFB\u3002", note: "\u653E\u6162\u4E00\u4E9B\uFF0C\u8EAB\u4F53\u77E5\u9053\u8BE5\u5F80\u54EA\u91CC\u53BB\u3002", image: "/stars/liu-tu-zhang.jpg", color: "#694aab" },
  { id: "xing-ri-ma", name: "\u661F\u65E5\u9A6C", animal: "\u9A6C", element: "\u65E5", quadrant: "\u5357\u65B9\u6731\u96C0", order: 4, line: "\u65E5\u661F\u5E76\u9A70\uFF0C\u5954\u8DD1\u4E5F\u9700\u8981\u770B\u89C1\u5929\u8272\u3002", note: "\u5411\u524D\u4E4B\u524D\uFF0C\u5148\u786E\u8BA4\u4F60\u4E3A\u4F55\u51FA\u53D1\u3002", image: "/stars/xing-ri-ma.jpg", color: "#d78596" },
  { id: "zhang-yue-lu", name: "\u5F20\u6708\u9E7F", animal: "\u9E7F", element: "\u6708", quadrant: "\u5357\u65B9\u6731\u96C0", order: 5, line: "\u6708\u5F20\u9E7F\u89D2\uFF0C\u654F\u611F\u662F\u63A5\u6536\u4E16\u754C\u7684\u65B9\u5F0F\u3002", note: "\u5141\u8BB8\u611F\u53D7\u5148\u4E8E\u89E3\u91CA\u5230\u8FBE\u3002", image: "/stars/zhang-yue-lu.jpg", color: "#549f9d" },
  { id: "yi-huo-she", name: "\u7FFC\u706B\u86C7", animal: "\u86C7", element: "\u706B", quadrant: "\u5357\u65B9\u6731\u96C0", order: 6, line: "\u7FFC\u706B\u63A0\u7A7A\uFF0C\u8715\u53D8\u4E0D\u5FC5\u90D1\u91CD\u5BA3\u544A\u3002", note: "\u653E\u4E0B\u65E7\u76AE\uFF0C\u7ED9\u65B0\u7684\u52A8\u4F5C\u4E00\u70B9\u7A7A\u95F4\u3002", image: "/stars/yi-huo-she.jpg", color: "#e76d3b" },
  { id: "zhen-shui-yin", name: "\u8F78\u6C34\u8693", animal: "\u8693", element: "\u6C34", quadrant: "\u5357\u65B9\u6731\u96C0", order: 7, line: "\u8F78\u5BBF\u5982\u8F66\uFF0C\u6C34\u58F0\u628A\u8DEF\u5F84\u62C9\u957F\u3002", note: "\u5728\u8FC1\u79FB\u91CC\uFF0C\u4ECD\u8981\u8BB0\u4F4F\u81EA\u5DF1\u7684\u8F74\u5FC3\u3002", image: "/stars/zhen-shui-yin.jpg", color: "#477ab2" }
];

// ../黑客松/src/slot/slotContent.ts
var verifiedArtwork = Object.freeze({
  "dou-mu-xie": "/stars/verified/dou-mu-xie.webp",
  "niu-jin-niu": "/stars/verified/niu-jin-niu.webp",
  "nv-tu-fu": "/stars/verified/nv-tu-fu.webp",
  "xu-ri-shu": "/stars/verified/xu-ri-shu.webp",
  "wei-yue-yan": "/stars/verified/wei-yue-yan.webp",
  "shi-huo-zhu": "/stars/verified/shi-huo-zhu.webp",
  "bi-shui-yu": "/stars/verified/bi-shui-yu.webp",
  "lou-jin-gou": "/stars/verified/lou-jin-gou.webp",
  "zi-huo-hou": "/stars/verified/zi-huo-hou.webp",
  "shen-shui-yuan": "/stars/verified/shen-shui-yuan.webp",
  "jing-mu-an": "/stars/verified/jing-mu-an.webp",
  "gui-jin-yang": "/stars/verified/gui-jin-yang.webp",
  "liu-tu-zhang": "/stars/verified/liu-tu-zhang.webp",
  "xing-ri-ma": "/stars/verified/xing-ri-ma.webp",
  "zhang-yue-lu": "/stars/verified/zhang-yue-lu.webp",
  "yi-huo-she": "/stars/verified/yi-huo-she.webp",
  "zhen-shui-yin": "/stars/verified/zhen-shui-yin.webp"
});
function fallbackArtwork(mansion) {
  const markup = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 768"><rect width="512" height="768" fill="#100b0d"/><circle cx="256" cy="330" r="154" fill="${mansion.color}" fill-opacity=".28"/><text x="256" y="350" text-anchor="middle" font-family="serif" font-size="190" fill="${mansion.color}">${mansion.animal}</text><text x="256" y="610" text-anchor="middle" font-family="serif" font-size="44" fill="#f5ead4">${mansion.name}</text></svg>`;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(markup)}`;
}
var slotSymbols = starMansions.map((mansion) => {
  const artwork = verifiedArtwork[mansion.id];
  return {
    id: mansion.id,
    label: mansion.name,
    glyph: mansion.animal,
    image: artwork ?? fallbackArtwork(mansion),
    quadrant: mansion.quadrant,
    element: mansion.element,
    animal: mansion.animal,
    color: mansion.color,
    line: mansion.line,
    note: mansion.note,
    hasArtwork: Boolean(artwork)
  };
});

// ../黑客松/src/destiny/adapters/guardianMatch.ts
var mainStars = Object.freeze([
  { id: "ziwei", title: "\u7D2B\u5FAE", persona: "\u7384\u5195\u6570\u636E\u5E1D\u541B", nature: "\u4E3B\u5BFC\u3001\u5C0A\u4E25\u3001\u6574\u5408", shadow: "\u81EA\u5C0A\u3001\u8DDD\u79BB\u611F\u3001\u63A7\u5236\u6B32", quote: "\u7FA4\u661F\u4E0D\u4E89\u4F4D\uFF0C\u5E1D\u5EA7\u81EA\u6210\u5FC3\u3002", oracle: "\u5E1D\u661F\u9759\u9ED8\uFF0C\u5148\u5B9A\u4E2D\u8F74\uFF0C\u518D\u5B9A\u4E07\u8C61\u3002", colors: ["#c8a7ff", "#f6d365", "#5eead4", "#111827"] },
  { id: "tianji", title: "\u5929\u673A", persona: "\u9752\u7FBD\u673A\u5173\u7B56\u58EB", nature: "\u806A\u654F\u3001\u7B56\u5212\u3001\u53D8\u5316", shadow: "\u591A\u8651\u3001\u6447\u6446\u3001\u8FC7\u5EA6\u63A8\u6F14", quote: "\u4E00\u5FF5\u62E8\u8F6C\uFF0C\u4E07\u8DEF\u7686\u5F00\u3002", oracle: "\u5929\u673A\u5DF2\u52A8\uFF0C\u7B54\u6848\u85CF\u5728\u4E0B\u4E00\u6B21\u8F6C\u5411\u3002", colors: ["#56f39a", "#38bdf8", "#d1fae5", "#0f172a"] },
  { id: "taiyang", title: "\u592A\u9633", persona: "\u91D1\u8F6E\u66E6\u5149\u884C\u8005", nature: "\u70ED\u8BDA\u3001\u516C\u4E49\u3001\u5916\u653E", shadow: "\u8017\u80FD\u3001\u6025\u5207\u3001\u592A\u60F3\u8BC1\u660E", quote: "\u613F\u4EE5\u4E00\u8EAB\u660E\uFF0C\u7167\u89C1\u4F17\u4EBA\u8DEF\u3002", oracle: "\u592A\u9633\u8BF4\uFF1A\u5148\u628A\u5FC3\u7167\u4EAE\uFF0C\u518D\u53BB\u7167\u4EAE\u4E8B\u3002", colors: ["#ffd166", "#ff7a18", "#fff7ad", "#1f1300"] },
  { id: "wuqu", title: "\u6B66\u66F2", persona: "\u94F6\u7532\u94C1\u7B97\u76D8\u5C06", nature: "\u52A1\u5B9E\u3001\u679C\u65AD\u3001\u6548\u7387", shadow: "\u51B7\u786C\u3001\u56FA\u6267\u3001\u53EA\u770B\u7ED3\u679C", quote: "\u94C1\u58F0\u843D\u5904\uFF0C\u865A\u6570\u6210\u91D1\u3002", oracle: "\u6B66\u66F2\u4E0D\u8BB8\u542B\u7CCA\uFF0C\u628A\u4EE3\u4EF7\u4E0E\u6536\u76CA\u5199\u6E05\u3002", colors: ["#dbeafe", "#94a3b8", "#38bdf8", "#0f172a"] },
  { id: "tiantong", title: "\u5929\u540C", persona: "\u4E91\u6C34\u7409\u7483\u7AE5\u541B", nature: "\u6E29\u548C\u3001\u77E5\u8DB3\u3001\u7597\u6108", shadow: "\u4F9D\u8D56\u3001\u9003\u907F\u3001\u6015\u51B2\u7A81", quote: "\u67D4\u6C34\u4E0D\u4E89\uFF0C\u4E07\u82E6\u81EA\u8F7B\u3002", oracle: "\u5929\u540C\u628A\u950B\u8292\u6309\u4F4E\u4E00\u70B9\uFF0C\u8BA9\u5FC3\u5148\u7F13\u8FC7\u6765\u3002", colors: ["#7dd3fc", "#a7f3d0", "#e0f2fe", "#082f49"] },
  { id: "lianzhen", title: "\u5EC9\u8D1E", persona: "\u7EEF\u7F51\u8A93\u7EA6\u5BA1\u5224\u8005", nature: "\u539F\u5219\u3001\u9B45\u529B\u3001\u8FA8\u660E", shadow: "\u7EA0\u7ED3\u3001\u731C\u7591\u3001\u7231\u618E\u592A\u70C8", quote: "\u70C8\u706B\u5165\u5F8B\uFF0C\u65B9\u77E5\u4F55\u4E3A\u5FC3\u6212\u3002", oracle: "\u5EC9\u8D1E\u63D0\u9192\u4F60\uFF1A\u8FB9\u754C\u4E0D\u662F\u51B7\u6F20\uFF0C\u662F\u5C0A\u91CD\u3002", colors: ["#fb7185", "#7f1d1d", "#fbbf24", "#111827"] },
  { id: "tianfu", title: "\u5929\u5E9C", persona: "\u7389\u5E93\u4E30\u4EEA\u638C\u85CF\u5B98", nature: "\u7A33\u91CD\u3001\u539A\u5B9E\u3001\u8C03\u5EA6", shadow: "\u4FDD\u5B88\u3001\u5B89\u9038\u3001\u6162\u70ED", quote: "\u85CF\u4E07\u7269\u8005\uFF0C\u4E0D\u9732\u950B\u8292\u3002", oracle: "\u5929\u5E9C\u8BA9\u4F60\u5148\u76D8\u70B9\u5DF2\u6709\u4E4B\u7269\uFF0C\u8DEF\u4E0D\u53EA\u5728\u8FDC\u5904\u3002", colors: ["#86efac", "#facc15", "#d9f99d", "#052e16"] },
  { id: "taiyin", title: "\u592A\u9634", persona: "\u94F6\u6708\u955C\u6E56\u7EC7\u68A6\u8005", nature: "\u7EC6\u817B\u3001\u84C4\u517B\u3001\u5BA1\u7F8E", shadow: "\u654F\u611F\u3001\u8FDF\u7591\u3001\u60C5\u7EEA\u6F6E\u6C50", quote: "\u6708\u4E0D\u8A00\u6EE1\uFF0C\u6F6E\u81EA\u6709\u58F0\u3002", oracle: "\u592A\u9634\u8BF4\uFF1A\u6162\u4E00\u70B9\uFF0C\u771F\u6B63\u7684\u7B54\u6848\u4F1A\u6D6E\u4E0A\u6765\u3002", colors: ["#e0f2fe", "#a5b4fc", "#f8fafc", "#0f172a"] },
  { id: "tanlang", title: "\u8D2A\u72FC", persona: "\u9713\u7FBD\u6B32\u671B\u6B4C\u8005", nature: "\u624D\u827A\u3001\u793E\u4EA4\u3001\u6B32\u671B", shadow: "\u8D2A\u591A\u3001\u653E\u7EB5\u3001\u5206\u5FC3", quote: "\u6B32\u6D77\u6709\u661F\uFF0C\u77E5\u6B62\u5373\u660E\u3002", oracle: "\u8D2A\u72FC\u95EE\u4F60\uFF1A\u8FD9\u662F\u70ED\u7231\uFF0C\u8FD8\u662F\u88AB\u70ED\u95F9\u7275\u8D70\uFF1F", colors: ["#f472b6", "#8b5cf6", "#22d3ee", "#1e1b4b"] },
  { id: "jumen", title: "\u5DE8\u95E8", persona: "\u7384\u95E8\u8FA9\u5F71\u672F\u58EB", nature: "\u8868\u8FBE\u3001\u8D28\u7591\u3001\u6D1E\u5BDF", shadow: "\u53E3\u820C\u3001\u9634\u90C1\u3001\u4E0D\u4FE1\u4EFB", quote: "\u95EE\u5230\u6697\u5904\uFF0C\u771F\u76F8\u624D\u56DE\u58F0\u3002", oracle: "\u5DE8\u95E8\u4E0D\u6015\u8D28\u7591\uFF0C\u4F46\u8981\u8BA9\u8BED\u8A00\u7167\u89C1\uFF0C\u800C\u4E0D\u662F\u906E\u853D\u3002", colors: ["#60a5fa", "#1e3a8a", "#c4b5fd", "#020617"] },
  { id: "tianxiang", title: "\u5929\u76F8", persona: "\u9752\u5370\u8861\u4EEA\u8F85\u81E3", nature: "\u7AEF\u6B63\u3001\u516C\u5E73\u3001\u652F\u63F4", shadow: "\u987E\u8651\u3001\u4F9D\u9644\u3001\u6015\u5931\u4F53\u9762", quote: "\u6301\u5370\u8005\u6B63\uFF0C\u4E07\u4E8B\u6709\u51ED\u3002", oracle: "\u5929\u76F8\u8BA9\u4F60\u56DE\u5230\u89C4\u77E9\u91CC\uFF0C\u770B\u54EA\u4E00\u65B9\u9700\u8981\u88AB\u516C\u5E73\u5BF9\u5F85\u3002", colors: ["#67e8f9", "#34d399", "#f8fafc", "#064e3b"] },
  { id: "tianliang", title: "\u5929\u6881", persona: "\u767D\u6A90\u53E4\u9053\u5E87\u62A4\u8005", nature: "\u9053\u4E49\u3001\u5E87\u62A4\u3001\u6E05\u8D35", shadow: "\u8BF4\u6559\u3001\u5B64\u9AD8\u3001\u66FF\u4EBA\u80CC\u91CD", quote: "\u6A90\u4E0B\u6709\u706F\uFF0C\u98CE\u96E8\u4E0D\u4FB5\u3002", oracle: "\u5929\u6881\u8BF4\uFF1A\u4F60\u80FD\u62A4\u4EBA\uFF0C\u4E5F\u8981\u7ED9\u81EA\u5DF1\u7559\u5C4B\u6A90\u3002", colors: ["#f5f5f4", "#84cc16", "#facc15", "#1c1917"] },
  { id: "qisha", title: "\u4E03\u6740", persona: "\u8D64\u5203\u4E03\u66DC\u6218\u5C06", nature: "\u9B44\u529B\u3001\u7A81\u7834\u3001\u72EC\u7ACB", shadow: "\u5B64\u7EDD\u3001\u6025\u8FDB\u3001\u4F24\u4EBA\u4F24\u5DF1", quote: "\u4E00\u5203\u65E2\u51FA\uFF0C\u4E0D\u95EE\u56DE\u7A0B\u3002", oracle: "\u4E03\u6740\u7ED9\u4F60\u52C7\u6C14\uFF0C\u4E5F\u8981\u4F60\u4E3A\u6BCF\u4E00\u5200\u8D1F\u8D23\u3002", colors: ["#ef4444", "#f97316", "#cbd5e1", "#111827"] },
  { id: "pojun", title: "\u7834\u519B", persona: "\u88C2\u6D77\u91CD\u6784\u5148\u950B", nature: "\u9769\u65B0\u3001\u91CD\u7F6E\u3001\u5192\u9669", shadow: "\u7834\u8017\u3001\u53DB\u9006\u3001\u4E0D\u8010\u7A33\u5B9A", quote: "\u65E7\u57CE\u65E2\u88C2\uFF0C\u65B0\u6D77\u81EA\u751F\u3002", oracle: "\u7834\u519B\u4E0D\u95EE\u4F60\u6015\u4E0D\u6015\uFF0C\u53EA\u95EE\u65E7\u58F3\u8FD8\u5408\u4E0D\u5408\u8EAB\u3002", colors: ["#38bdf8", "#0f172a", "#a855f7", "#f8fafc"] }
]);
var mainStarKeywords = Object.freeze({
  ziwei: ["\u4E2D\u5FC3", "\u6574\u5408", "\u79E9\u5E8F", "\u4E3B\u6301", "\u627F\u62C5", "\u8D23\u4EFB", "\u51B3\u5B9A"],
  tianji: ["\u53D8\u5316", "\u8F6C\u5411", "\u601D\u8003", "\u8BA1\u5212", "\u8BD5\u63A2", "\u65B0\u8DEF", "\u65B9\u5411"],
  taiyang: ["\u7167\u4EAE", "\u70ED\u60C5", "\u5206\u4EAB", "\u884C\u52A8", "\u516C\u5F00", "\u660E\u4EAE", "\u5E2E\u52A9"],
  wuqu: ["\u5B9E\u9645", "\u6548\u7387", "\u7ED3\u679C", "\u4EE3\u4EF7", "\u6E05\u695A", "\u6267\u884C", "\u53EF\u9760"],
  tiantong: ["\u6E29\u548C", "\u4F11\u606F", "\u7F13\u6162", "\u7167\u6599", "\u8F7B\u677E", "\u67D4\u8F6F", "\u548C\u89E3"],
  lianzhen: ["\u8FB9\u754C", "\u539F\u5219", "\u5C0A\u91CD", "\u8FA8\u660E", "\u9009\u62E9", "\u514B\u5236", "\u627F\u8BFA"],
  tianfu: ["\u5B89\u7A33", "\u5DF2\u6709", "\u79EF\u7D2F", "\u4FDD\u5B58", "\u8C03\u5EA6", "\u751F\u6D3B", "\u539A\u5B9E"],
  taiyin: ["\u7EC6\u8282", "\u5B89\u9759", "\u611F\u53D7", "\u7559\u767D", "\u5BA1\u7F8E", "\u6162\u4E00\u70B9", "\u5185\u5FC3"],
  tanlang: ["\u70ED\u7231", "\u597D\u5947", "\u793E\u4EA4", "\u6B32\u671B", "\u624D\u827A", "\u70ED\u95F9", "\u5C1D\u8BD5"],
  jumen: ["\u63D0\u95EE", "\u8BED\u8A00", "\u6000\u7591", "\u771F\u76F8", "\u8868\u8FBE", "\u503E\u542C", "\u89E3\u91CA"],
  tianxiang: ["\u516C\u5E73", "\u534F\u52A9", "\u89C4\u5219", "\u5E73\u8861", "\u53CC\u65B9", "\u652F\u63F4", "\u4F53\u9762"],
  tianliang: ["\u4FDD\u62A4", "\u5B88\u62A4", "\u9053\u4E49", "\u7167\u987E", "\u5C4B\u6A90", "\u627F\u62C5", "\u7ED9\u81EA\u5DF1"],
  qisha: ["\u52C7\u6C14", "\u7A81\u7834", "\u72EC\u7ACB", "\u679C\u65AD", "\u9762\u5BF9", "\u98CE\u9669", "\u950B\u5229"],
  pojun: ["\u91CD\u6765", "\u6539\u53D8", "\u6253\u7834", "\u65E7\u7684", "\u91CD\u6784", "\u5192\u9669", "\u79BB\u5F00"]
});
var mansionKeywords = Object.freeze({
  "jiao-mu-jiao": ["\u5F00\u59CB", "\u6253\u5F00", "\u5411\u4E0A", "\u7B2C\u4E00", "\u65B0\u751F", "\u7F1D\u9699"],
  "kang-jin-long": ["\u5C3A\u5EA6", "\u8FB9\u754C", "\u62AC\u5934", "\u575A\u5B9A", "\u950B\u8292", "\u5B88\u4F4F"],
  "di-tu-he": ["\u811A\u4E0B", "\u6839", "\u5B89\u653E", "\u7A33\u5B9A", "\u843D\u5730", "\u751F\u957F"],
  "fang-ri-tu": ["\u7EC6\u8282", "\u6CE8\u610F", "\u663E\u5F62", "\u5FAE\u5C0F", "\u5F53\u4E0B", "\u770B\u89C1"],
  "xin-yue-hu": ["\u5185\u5FC3", "\u654F\u9510", "\u8FA8\u522B", "\u6162\u4E00\u70B9", "\u611F\u53D7", "\u5B89\u9759"],
  "wei-huo-hu": ["\u884C\u52A8", "\u51B2\u52A8", "\u529B\u91CF", "\u660E\u786E", "\u6536\u675F", "\u52C7\u6C14"],
  "ji-shui-bao": ["\u53D8\u5316", "\u56DE\u65CB", "\u4F59\u5730", "\u6D41\u52A8", "\u5C55\u5F00", "\u9002\u5E94"],
  "dou-mu-xie": ["\u65B9\u5411", "\u5224\u65AD", "\u6E05\u695A", "\u62B5\u8FBE", "\u9009\u62E9", "\u8FA8\u660E"],
  "niu-jin-niu": ["\u53EF\u9760", "\u91CD\u590D", "\u6F2B\u957F", "\u575A\u6301", "\u8D1F\u91CD", "\u79EF\u7D2F"],
  "nv-tu-fu": ["\u9759\u5904", "\u503E\u542C", "\u56DE\u7B54", "\u58F0\u97F3", "\u591C\u665A", "\u6C89\u9ED8"],
  "xu-ri-shu": ["\u7559\u767D", "\u672A\u53D1\u751F", "\u5C0F\u7A97", "\u7A7A\u7F3A", "\u53EF\u80FD", "\u7B49\u5F85"],
  "wei-yue-yan": ["\u4E0D\u786E\u5B9A", "\u843D\u70B9", "\u8F7B\u8EAB", "\u8D8A\u8FC7", "\u60AC\u5904", "\u98CE\u9669"],
  "shi-huo-zhu": ["\u5B88\u62A4", "\u6E29\u70ED", "\u7167\u6599", "\u5177\u4F53", "\u751F\u6D3B", "\u5BB6"],
  "bi-shui-yu": ["\u8FB9\u754C", "\u5B89\u9759", "\u6536\u7EB3", "\u5BB9\u7EB3", "\u5185\u5916", "\u4FDD\u62A4"],
  "kui-mu-lang": ["\u8FDC\u65B9", "\u51DD\u89C6", "\u72EC\u884C", "\u76EE\u6807", "\u8FFD\u5BFB", "\u591C\u8DEF"],
  "lou-jin-gou": ["\u95E8\u6237", "\u4FE1\u4EFB", "\u5B88\u5019", "\u5FE0\u5B9E", "\u9760\u8FD1", "\u770B\u5B88"],
  "wei-tu-zhi": ["\u65E5\u5E38", "\u6ECB\u517B", "\u8010\u5FC3", "\u51C6\u5907", "\u571F\u5730", "\u751F\u8BA1"],
  "mao-ri-ji": ["\u6E05\u6668", "\u9192\u6765", "\u5BA3\u544A", "\u5149", "\u8282\u594F", "\u5F00\u59CB"],
  "bi-yue-wu": ["\u8FDE\u63A5", "\u7F51", "\u5173\u7CFB", "\u534F\u4F5C", "\u805A\u5408", "\u7ECF\u7EAC"],
  "zi-huo-hou": ["\u7075\u5DE7", "\u8F6C\u6362", "\u6E38\u620F", "\u673A\u654F", "\u706B\u82B1", "\u53D8\u5316"],
  "shen-shui-yuan": ["\u6DF1\u5904", "\u63A2\u7D22", "\u6F5C\u884C", "\u672A\u77E5", "\u7A7F\u8D8A", "\u6C34"],
  "jing-mu-an": ["\u6E90\u5934", "\u4F9B\u7ED9", "\u5206\u4EAB", "\u5171\u540C", "\u4E95", "\u6ECB\u517B"],
  "gui-jin-yang": ["\u95E8\u69DB", "\u544A\u522B", "\u8FC7\u6E21", "\u56DE\u671B", "\u6E29\u67D4", "\u672A\u77E5"],
  "liu-tu-zhang": ["\u8212\u5C55", "\u679D\u6761", "\u67D4\u97E7", "\u6574\u7406", "\u751F\u957F", "\u4ECE\u5BB9"],
  "xing-ri-ma": ["\u524D\u884C", "\u901F\u5EA6", "\u9053\u8DEF", "\u5954\u8DD1", "\u660E\u4EAE", "\u8FDC\u884C"],
  "zhang-yue-lu": ["\u5C55\u5F00", "\u8868\u8FBE", "\u821E\u53F0", "\u8212\u5C55", "\u9080\u8BF7", "\u5F00\u653E"],
  "yi-huo-she": ["\u5B66\u4E60", "\u7FFC", "\u5347\u8D77", "\u7EC3\u4E60", "\u706B", "\u6210\u719F"],
  "zhen-shui-yin": ["\u7ED3\u675F", "\u5F52\u6765", "\u56DE\u58F0", "\u6536\u5C3E", "\u6C89\u6DC0", "\u5B8C\u6210"]
});

// ../黑客松/server/deepseek.ts
var DeepSeekGatewayError = class extends Error {
  constructor(code) {
    super(code);
    this.code = code;
    this.name = "DeepSeekGatewayError";
  }
};
function buildMessages(input) {
  const exampleSourceId = JSON.stringify(input.sources[0].id);
  return [
    {
      role: "system",
      content: [
        "\u4F60\u662F\u4E92\u52A8\u827A\u672F\u4F5C\u54C1\u7684\u6709\u9650\u6587\u672C\u89E3\u91CA\u5668\uFF0C\u4E0D\u662F\u7B97\u547D\u5E08\u6216\u4EBA\u683C\u8BC6\u522B\u6A21\u578B\u3002",
        "\u53EA\u80FD\u4F7F\u7528\u7528\u6237\u6D88\u606F\u4E2D\u63D0\u4F9B\u7684 evidence \u548C sources\uFF0C\u4E0D\u5F97\u589E\u8865\u4E66\u540D\u3001\u539F\u6587\u3001\u7AE0\u8282\u6216\u89C4\u5219\u3002",
        "\u4F20\u7EDF\u6750\u6599\u53EA\u505A\u6587\u5316\u9690\u55BB\uFF1B\u53EF\u89C1\u52A8\u4F5C\u53EA\u505A\u5F53\u65F6\u72B6\u6001\u6458\u8981\uFF0C\u4E0D\u5F97\u63A8\u65AD\u4EBA\u683C\u3001\u5065\u5EB7\u3001\u8D22\u5BCC\u3001\u5173\u7CFB\u3001\u80FD\u529B\u3001\u8EAB\u4EFD\u6216\u547D\u8FD0\u3002",
        "\u8BF7\u8FD4\u56DE 8 \u81F3 12 \u6761\u7B80\u6D01\u4E2D\u6587\u63CF\u8FF0\uFF0C\u6BCF\u6761 text \u5FC5\u987B\u4EE5\u201C\u4F60\u201D\u5F00\u5934\uFF0C\u4EE5\u4F18\u70B9\u548C\u53EF\u884C\u52A8\u7684\u529B\u91CF\u4E3A\u4E3B\uFF0C\u5141\u8BB8\u8F7B\u5FAE\u5E7D\u9ED8\uFF0C\u5E76\u81EA\u7136\u4F7F\u7528\u5C71\u6C34\u3001\u661F\u6708\u3001\u677E\u7AF9\u3001\u821F\u706F\u7B49\u53E4\u5178\u610F\u8C61\u3002",
        "\u8BED\u6C14\u79EF\u6781\u4F46\u4FDD\u7559\u4E0D\u786E\u5B9A\u6027\uFF1B\u6BCF\u6761 sourceIds \u5FC5\u987B\u6765\u81EA\u63D0\u4F9B\u7684 sources\u3002\u5185\u90E8\u53EF\u5173\u8054\u6240\u7ED9\u89C2\u5BDF\u4E0E\u4F20\u7EDF\u6750\u6599\uFF0C\u4F46\u6700\u7EC8\u53EA\u8FD4\u56DE JSON\u3002",
        "\u4E0D\u5F97\u4ECE\u5916\u8C8C\u63A8\u65AD\u4EBA\u683C\u3001\u5065\u5EB7\u3001\u8D22\u5BCC\u3001\u5173\u7CFB\u3001\u80FD\u529B\u3001\u8EAB\u4EFD\u6216\u547D\u8FD0\uFF1B\u4E0D\u5F97\u4F7F\u7528\u8138\u578B\u6807\u7B7E\u3001\u9762\u76F8\u8BC4\u5206\u3001\u786E\u5B9A\u6027\u65AD\u8BED\u6216\u865A\u6784\u5F15\u6587\u3002",
        "\u9762\u90E8\u6846\u67B6 observation \u53EA\u53EF\u4F5C\u4E3A\u4F5C\u54C1\u4E2D\u7684\u6784\u56FE\u7EBF\u7D22\u548C\u5386\u53F2\u89C2\u770B\u6846\u67B6\uFF0C\u4E0D\u53EF\u4F5C\u4E3A\u5185\u5728\u7279\u5F81\u7684\u8BC1\u636E\u3002",
        `\u672C\u6B21\u552F\u4E00\u5141\u8BB8\u5F15\u7528\u7684 sourceIds \u662F\uFF1A${input.sources.map((source) => source.id).join(", ")}\u3002`,
        "\u65E0\u6CD5\u6839\u636E\u6750\u6599\u652F\u6301\u7684\u5185\u5BB9\u653E\u5165 unsupported\uFF0C\u4E0D\u5F97\u731C\u6D4B\u3002",
        "\u53EA\u8F93\u51FA\u4E0B\u5217 JSON \u5BF9\u8C61\uFF0C\u4E0D\u5F97\u52A0 Markdown \u6216\u5176\u4ED6\u5B57\u6BB5\uFF1A",
        `{"statements":[{"id":"statement-1","text":"\u4F60\u2026\u2026","interpretationType":"cultural-metaphor | observable-summary | user-reflection","sourceIds":[${exampleSourceId}],"reasoning":"\u8BF4\u660E\u5982\u4F55\u4ECE\u8282\u9009\u5F97\u51FA\u8FD9\u4E00\u6F14\u7ECE","caveat":"\u8BF4\u660E\u8FB9\u754C\u4E0E\u4E0D\u786E\u5B9A\u6027"}],"unsupported":[]}`
      ].join("\n")
    },
    {
      role: "user",
      content: JSON.stringify(input)
    }
  ];
}
function buildModernMessages(input) {
  return [
    {
      role: "system",
      content: [
        "\u4F60\u662F\u4E92\u52A8\u827A\u672F\u4F5C\u54C1\u4E2D\u6807\u8BB0\u4E3A MODEL_HYPOTHESIS \u7684\u6709\u9650\u6587\u672C\u751F\u6210\u5668\uFF0C\u4E0D\u662F\u4EBA\u683C\u8BC6\u522B\u6A21\u578B\u3002",
        "\u53EA\u80FD\u4F7F\u7528\u7528\u6237\u6D88\u606F\u4E2D\u63D0\u4F9B\u7684\u805A\u5408 evidence\u3001\u89C2\u4F17\u4E3B\u52A8\u9009\u62E9\u7684 selectedStatements \u548C\u767B\u8BB0 sources\u3002",
        "\u8F93\u5165\u4E0D\u542B\u4E5F\u4E0D\u5F97\u4E0A\u4F20\u6216\u63A8\u6D4B\u539F\u59CB\u56FE\u50CF\u3001\u4EBA\u8138\u70B9\u4F4D\u3001\u59D3\u540D\u3001\u751F\u65E5\u3001\u57CE\u5E02\u3001\u8EAB\u4EFD\u6216\u751F\u7269\u7279\u5F81\u3002",
        "\u6BCF\u6761\u53EA\u80FD\u628A\u53EF\u89C1\u52A8\u4F5C\u5199\u6210\u201C\u8FD9\u6BB5\u4EA4\u4E92\u91CC\u201D\u7684\u4E34\u65F6\u89C2\u5BDF\u6216\u5F00\u653E\u53CD\u601D\uFF0C\u4E0D\u5F97\u4ECE\u9762\u90E8\u52A8\u4F5C\u63A8\u65AD\u7A33\u5B9A\u4EBA\u683C\u3001\u771F\u5B9E\u60C5\u7EEA\u3001\u5065\u5EB7\u3001\u80FD\u529B\u3001\u8D22\u5BCC\u3001\u5173\u7CFB\u3001\u8EAB\u4EFD\u6216\u547D\u8FD0\u3002",
        "\u8BF7\u8FD4\u56DE 4 \u81F3 8 \u6761\u7B80\u6D01\u4E2D\u6587\u5047\u8BBE\u3002\u6BCF\u6761 text \u5FC5\u987B\u4EE5\u201C\u4F60\u201D\u5F00\u5934\uFF1BevidenceIds \u548C sourceIds \u5FC5\u987B\u5206\u522B\u6765\u81EA\u672C\u6B21\u63D0\u4F9B\u7684 evidence \u4E0E sources\u3002",
        "\u4E0D\u5F97\u4F7F\u7528\u201C\u6CE8\u5B9A\u3001\u8BC1\u660E\u3001\u4E00\u5B9A\u3001\u5929\u751F\u3001\u6027\u683C\u5C31\u662F\u3001\u80FD\u529B\u5F88\u5F3A/\u5F31\u201D\u7B49\u786E\u5B9A\u6027\u5224\u65AD\u3002caveat \u5FC5\u987B\u660E\u786E\u5B83\u4E0D\u662F\u7A33\u5B9A\u4EBA\u683C\u3001\u60C5\u7EEA\u6216\u80FD\u529B\u7ED3\u8BBA\u3002",
        `\u672C\u6B21\u5141\u8BB8\u5F15\u7528\u7684 evidenceIds\uFF1A${input.evidence.map((item) => item.id).join(", ")}\u3002`,
        `\u672C\u6B21\u5141\u8BB8\u5F15\u7528\u7684 sourceIds\uFF1A${input.sources.map((item) => item.id).join(", ")}\u3002`,
        "\u53EA\u8F93\u51FA\u4E0B\u5217 JSON \u5BF9\u8C61\uFF0C\u4E0D\u5F97\u52A0 Markdown \u6216\u5176\u4ED6\u5B57\u6BB5\uFF1A",
        '{"statements":[{"id":"statement-1","text":"\u4F60\u2026\u2026","evidenceIds":["evidence-id"],"sourceIds":["source-id"],"reasoning":"\u4EC5\u8BF4\u660E\u8FD9\u6BB5\u4EA4\u4E92\u4E2D\u7684\u53EF\u89C1\u4F9D\u636E","caveat":"\u8FD9\u4E0D\u662F\u7A33\u5B9A\u4EBA\u683C\u3001\u60C5\u7EEA\u6216\u80FD\u529B\u5224\u65AD\u3002"}]}'
      ].join("\n")
    },
    { role: "user", content: JSON.stringify(input) }
  ];
}
function buildGuardianMatchMessages(input) {
  const mainStarCatalog = mainStars.map((star) => `${star.id}=${star.title}\uFF1B\u6027\u60C5\u610F\u8C61\uFF1A${star.nature}\uFF1B\u63D0\u9192\uFF1A${star.shadow}`).join("\n");
  const mansionCatalog = starMansions.map((mansion) => `${mansion.id}=${mansion.name}\uFF1B${mansion.quadrant}\uFF1B${mansion.line}${mansion.note}`).join("\n");
  return [
    {
      role: "system",
      content: [
        "\u4F60\u662F\u4E92\u52A8\u827A\u672F\u4F5C\u54C1\u7684\u5B88\u62A4\u795E\u5339\u914D\u5668\uFF0C\u53EA\u80FD\u4ECE\u767B\u8BB0\u7684\u5341\u56DB\u4E3B\u661F\u548C\u4E8C\u5341\u516B\u5BBF\u4E2D\u9009\u62E9\uFF0C\u4E0D\u662F\u7B97\u547D\u5E08\u6216\u4EBA\u683C\u8BC6\u522B\u6A21\u578B\u3002",
        "\u552F\u4E00\u4F9D\u636E\u662F\u89C2\u4F17\u4E3B\u52A8\u4FDD\u7559\u7684 selectedStatements\u3002\u4E0D\u5F97\u63A8\u65AD\u4EBA\u683C\u3001\u5065\u5EB7\u3001\u8D22\u5BCC\u3001\u5173\u7CFB\u3001\u80FD\u529B\u3001\u8EAB\u4EFD\u6216\u547D\u8FD0\uFF0C\u4E0D\u5F97\u4F7F\u7528\u5916\u8C8C\u3001\u751F\u8FB0\u6216\u6444\u50CF\u5934\u4FE1\u606F\u3002",
        input.mainStarId ? `mainStarId \u5DF2\u7531\u672C\u5730\u547D\u76D8\u7ED3\u6784\u56FA\u5B9A\u4E3A ${input.mainStarId}\uFF0C\u5FC5\u987B\u539F\u6837\u8FD4\u56DE\uFF0C\u4E0D\u5F97\u66F4\u6362\u3002` : "mainStarId \u5E94\u6309\u6240\u9009\u53E5\u5B50\u4E0E\u5341\u56DB\u4E3B\u661F\u6587\u5316\u610F\u8C61\u7684\u5173\u8054\u9009\u62E9\u3002",
        "mansionId \u5E94\u6309\u6240\u9009\u53E5\u5B50\u4E0E\u4E8C\u5341\u516B\u5BBF\u767B\u8BB0\u6545\u4E8B\u7684\u8BED\u4E49\u5173\u8054\u9009\u62E9\u3002reasoning \u53EA\u8BF4\u660E\u6587\u672C\u610F\u8C61\u7684\u5BF9\u5E94\uFF0C\u4E0D\u5F97\u5199\u6210\u6027\u683C\u5224\u65AD\u6216\u672A\u6765\u9884\u8A00\u3002",
        "\u5341\u56DB\u4E3B\u661F\u767B\u8BB0\uFF1A",
        mainStarCatalog,
        "\u4E8C\u5341\u516B\u5BBF\u767B\u8BB0\uFF1A",
        mansionCatalog,
        '\u53EA\u8F93\u51FA JSON\uFF1A{"mainStarId":"registered-id","mansionId":"registered-id","reasoning":"\u6240\u9009\u6587\u672C\u4E0E\u767B\u8BB0\u610F\u8C61\u7684\u5BF9\u5E94"}'
      ].join("\n")
    },
    { role: "user", content: JSON.stringify(input) }
  ];
}
function buildGuardianDialogueMessages(input) {
  const mainStar = mainStars.find((star) => star.id === input.mainStarId);
  const mansion = starMansions.find((item) => item.id === input.mansionId);
  return [
    {
      role: "system",
      content: [
        "\u4F60\u5728\u4E92\u52A8\u827A\u672F\u4F5C\u54C1\u4E2D\u626E\u6F14\u4E00\u4F4D\u5DF2\u56FA\u5B9A\u8EAB\u4EFD\u7684\u5B88\u62A4\u795E\uFF0C\u56DE\u7B54\u6807\u8BB0\u4E3A\u201C\u4F5C\u54C1\u6F14\u7ECE\u201D\u3002",
        `\u4E3B\u661F\u610F\u8C61\uFF1A${mainStar?.title ?? input.mainStarId}\uFF1B${mainStar?.nature ?? ""}\uFF1B${mainStar?.oracle ?? ""}`,
        `\u661F\u5BBF\u6545\u4E8B\uFF1A${mansion?.name ?? input.mansionId}\uFF1B${mansion?.line ?? ""}${mansion?.note ?? ""}`,
        "\u53EA\u56DE\u7B54\u5F53\u524D question\uFF0C\u4E0D\u4FDD\u7559\u3001\u590D\u8FF0\u6216\u7D22\u53D6\u8FC7\u5F80\u5BF9\u8BDD\u3002selectedStatements \u53EA\u63D0\u4F9B\u672C\u6B21\u4F5C\u54C1\u8BED\u5883\u3002",
        "\u7528\u7B80\u6D01\u3001\u7565\u5E26\u53E4\u6587\u8282\u594F\u4F46\u53EF\u7406\u89E3\u7684\u73B0\u4EE3\u4E2D\u6587\u56DE\u7B54\uFF0C\u5148\u7ED9\u4E00\u4E2A\u53EF\u505C\u9A7B\u7684\u610F\u8C61\uFF0C\u518D\u7ED9\u4E00\u4E2A\u4ECA\u5929\u53EF\u505A\u7684\u5C0F\u52A8\u4F5C\uFF0C\u6700\u540E\u7559\u4E00\u4E2A\u5F00\u653E\u95EE\u9898\u3002",
        "\u4E0D\u5F97\u58F0\u79F0\u5386\u53F2\u5F15\u6587\uFF0C\u4E0D\u5F97\u5192\u5145\u795E\u8C15\u6216\u4E8B\u5B9E\u6743\u5A01\uFF1B\u4E0D\u5F97\u9884\u6D4B\u672A\u6765\u3001\u65AD\u8A00\u4EBA\u683C\u3001\u8BCA\u65AD\u5065\u5EB7\u3001\u63D0\u4F9B\u6CD5\u5F8B\u6216\u91D1\u878D\u6307\u4EE4\uFF0C\u4E5F\u4E0D\u5F97\u4F7F\u7528\u6CE8\u5B9A\u3001\u5FC5\u7136\u3001\u4E00\u5B9A\u4F1A\u3001\u5929\u751F\u7B49\u786E\u5B9A\u6027\u63AA\u8F9E\u3002",
        '\u56DE\u7B54 36 \u81F3 120 \u4E2A\u6C49\u5B57\u3002\u53EA\u8F93\u51FA JSON\uFF1A{"answer":"\u4E00\u6BB5\u5F53\u524D\u56DE\u7B54"}'
      ].join("\n")
    },
    { role: "user", content: JSON.stringify(input) }
  ];
}
async function sendDeepSeekRequest(messages, options) {
  const fetchImpl = options.fetchImpl ?? fetch;
  const baseUrl = (options.baseUrl ?? "https://api.deepseek.com").replace(/\/$/, "");
  const requestBody = {
    model: options.model ?? "deepseek-v4-flash",
    messages,
    thinking: { type: "disabled" },
    temperature: 0.2,
    max_tokens: 1600
  };
  const sendAttempt = async () => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), options.timeoutMs ?? 25e3);
    const send = (useJsonMode) => fetchImpl(`${baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${options.apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(useJsonMode ? { ...requestBody, response_format: { type: "json_object" } } : requestBody),
      signal: controller.signal
    });
    try {
      let response = await send(true);
      if (response.status === 400 || response.status === 422) response = await send(false);
      if (!response.ok) {
        if (response.status === 401 || response.status === 403) throw new DeepSeekGatewayError("upstream-auth");
        if (response.status === 402) throw new DeepSeekGatewayError("upstream-quota");
        if (response.status === 429) throw new DeepSeekGatewayError("upstream-rate-limit");
        if (response.status === 400 || response.status === 404 || response.status === 422) {
          throw new DeepSeekGatewayError("upstream-request");
        }
        throw new DeepSeekGatewayError("upstream-status");
      }
      let envelope;
      try {
        envelope = await response.json();
      } catch (error) {
        if (error instanceof Error && error.name === "AbortError") throw error;
        throw new DeepSeekGatewayError("invalid-json");
      }
      const content = envelope.choices?.[0]?.message?.content;
      if (!content) throw new DeepSeekGatewayError("schema-rejected");
      return content;
    } catch (error) {
      if (error instanceof DeepSeekGatewayError) throw error;
      if (error instanceof Error && error.name === "AbortError") throw new DeepSeekGatewayError("timeout");
      throw new DeepSeekGatewayError("network");
    } finally {
      clearTimeout(timeout);
    }
  };
  for (let attempt = 0; attempt < 2; attempt += 1) {
    try {
      return await sendAttempt();
    } catch (error) {
      if (attempt === 0 && error instanceof DeepSeekGatewayError && error.code === "invalid-json") continue;
      throw error;
    }
  }
  throw new DeepSeekGatewayError("invalid-json");
}
var unsafeGuardianAnswer = /命中注定|注定|必然|一定会|天生|你(?:的)?性格(?:是|就是)|诊断|患有|处方|胜诉|违法|买入|卖出|投资回报|保证收益/;
function guardianAnswerIsAllowed(answer) {
  return !unsafeGuardianAnswer.test(answer);
}
async function requestGroundedReading(rawInput, options) {
  const input = deepSeekReadingRequestSchema.parse(rawInput);
  try {
    const content = await sendDeepSeekRequest(buildMessages(input), options);
    let parsed;
    try {
      parsed = deepSeekReadingModelSchema.parse(JSON.parse(content));
    } catch {
      throw new DeepSeekGatewayError("schema-rejected");
    }
    const allowedSourceIds = new Set(input.sources.map((source) => source.id));
    for (const statement of parsed.statements) {
      if (statement.sourceIds.some((sourceId) => !allowedSourceIds.has(sourceId))) {
        throw new DeepSeekGatewayError("unknown-citation");
      }
    }
    return { ...parsed, sourceKind: "deepseek", model: options.model ?? "deepseek-v4-flash" };
  } catch (error) {
    if (error instanceof DeepSeekGatewayError) throw error;
    throw new DeepSeekGatewayError("schema-rejected");
  }
}
async function requestModernReading(rawInput, options) {
  const input = modernReadingRequestSchema.parse(rawInput);
  try {
    const content = await sendDeepSeekRequest(buildModernMessages(input), options);
    let parsed;
    try {
      parsed = modernReadingModelSchema.parse(JSON.parse(content));
    } catch {
      throw new DeepSeekGatewayError("schema-rejected");
    }
    const evidenceIds = new Set(input.evidence.map((item) => item.id));
    const sourceIds = new Set(input.sources.map((item) => item.id));
    for (const statement of parsed.statements) {
      if (statement.evidenceIds.some((id) => !evidenceIds.has(id)) || statement.sourceIds.some((id) => !sourceIds.has(id))) {
        throw new DeepSeekGatewayError("unknown-citation");
      }
    }
    return { ...parsed, sourceKind: "deepseek", model: options.model ?? "deepseek-v4-flash" };
  } catch (error) {
    if (error instanceof DeepSeekGatewayError) throw error;
    throw new DeepSeekGatewayError("schema-rejected");
  }
}
async function requestGuardianMatch(rawInput, options) {
  const input = guardianMatchRequestSchema.parse(rawInput);
  if (input.mainStarId && !mainStars.some((star) => star.id === input.mainStarId)) {
    throw new DeepSeekGatewayError("unknown-citation");
  }
  try {
    const content = await sendDeepSeekRequest(buildGuardianMatchMessages(input), options);
    let parsed;
    try {
      parsed = guardianMatchModelSchema.parse(JSON.parse(content));
    } catch {
      throw new DeepSeekGatewayError("schema-rejected");
    }
    const knownMainStar = mainStars.some((star) => star.id === parsed.mainStarId);
    const knownMansion = starMansions.some((mansion) => mansion.id === parsed.mansionId);
    if (!knownMainStar || !knownMansion || input.mainStarId && parsed.mainStarId !== input.mainStarId) {
      throw new DeepSeekGatewayError("unknown-citation");
    }
    return { ...parsed, sourceKind: "deepseek", model: options.model ?? "deepseek-v4-flash" };
  } catch (error) {
    if (error instanceof DeepSeekGatewayError) throw error;
    throw new DeepSeekGatewayError("schema-rejected");
  }
}
async function requestGuardianDialogue(rawInput, options) {
  const input = guardianDialogueRequestSchema.parse(rawInput);
  if (!mainStars.some((star) => star.id === input.mainStarId) || !starMansions.some((mansion) => mansion.id === input.mansionId)) {
    throw new DeepSeekGatewayError("unknown-citation");
  }
  try {
    const content = await sendDeepSeekRequest(buildGuardianDialogueMessages(input), options);
    let parsed;
    try {
      parsed = guardianDialogueModelSchema.parse(JSON.parse(content));
    } catch {
      throw new DeepSeekGatewayError("schema-rejected");
    }
    if (!guardianAnswerIsAllowed(parsed.answer)) throw new DeepSeekGatewayError("schema-rejected");
    return { ...parsed, sourceKind: "deepseek", model: options.model ?? "deepseek-v4-flash" };
  } catch (error) {
    if (error instanceof DeepSeekGatewayError) throw error;
    throw new DeepSeekGatewayError("schema-rejected");
  }
}

// ../黑客松/server/localCuration.ts
function visualSeed(summary) {
  return Math.abs(Math.round(
    summary.faceWidthRatio * 101 + summary.faceHeightRatio * 211 + summary.landmarkCount * 7 + summary.particleLuminance * 13
  ));
}
function localFigureEcho(summary) {
  const selected = figureEchoes[visualSeed(summary) % figureEchoes.length];
  return {
    ...selected,
    sourceKind: "fallback",
    limitations: ["\u6709\u9650\u8096\u50CF\u5E93\u4E2D\u7684\u827A\u672F\u5316\u89C6\u89C9\u56DE\u58F0\uFF0C\u4E0D\u4EE3\u8868\u76F8\u4F3C\u8EAB\u4EFD\u3001\u4EBA\u683C\u6216\u547D\u8FD0\u3002"]
  };
}
var statePremise = {
  staying: "\u5982\u679C\u4F60\u7EE7\u7EED\u4E0E\u6B64\u523B\u5171\u5904\uFF0C\u5E76\u4FDD\u7559\u5F53\u524D\u65B9\u5F0F\u2026\u2026",
  exploring: "\u5982\u679C\u4F60\u7EE7\u7EED\u628A\u672A\u77E5\u5F53\u4F5C\u7EBF\u7D22\uFF0C\u5E76\u4FDD\u7559\u5F53\u524D\u65B9\u5F0F\u2026\u2026",
  turning: "\u5982\u679C\u4F60\u7EE7\u7EED\u6821\u51C6\u73B0\u6709\u65B9\u5411\uFF0C\u5E76\u4FDD\u7559\u5F53\u524D\u65B9\u5F0F\u2026\u2026"
};
var actionBranches = {
  waiting: {
    possibility: "\u66F4\u591A\u7EBF\u7D22\u53EF\u80FD\u5728\u4E0D\u88AB\u50AC\u4FC3\u65F6\u9010\u6E10\u663E\u73B0\uFF0C\u4F7F\u5224\u65AD\u4FDD\u7559\u5FC5\u8981\u7684\u4F59\u5730\u3002",
    cost: "\u7B49\u5F85\u4E5F\u53EF\u80FD\u8BA9\u719F\u6089\u7684\u6A21\u5F0F\u7EE7\u7EED\u81EA\u6211\u5DE9\u56FA\uFF0C\u8BA9\u4E00\u4E2A\u8DB3\u591F\u5C0F\u7684\u52A8\u4F5C\u88AB\u63A8\u8FDF\u3002",
    question: "\u4F60\u662F\u5728\u7B49\u5F85\u66F4\u591A\u7EBF\u7D22\uFF0C\u8FD8\u662F\u5728\u7B49\u5F85\u4E0D\u518D\u9700\u8981\u627F\u62C5\u4E0D\u786E\u5B9A\uFF1F"
  },
  testing: {
    possibility: "\u5C0F\u8303\u56F4\u8BD5\u63A2\u53EF\u80FD\u6362\u6765\u771F\u5B9E\u56DE\u5E94\uFF0C\u8BA9\u65B9\u5411\u5728\u6709\u9650\u4EE3\u4EF7\u4E2D\u88AB\u91CD\u65B0\u6821\u51C6\u3002",
    cost: "\u53CD\u590D\u8BD5\u63A2\u4E5F\u53EF\u80FD\u4F7F\u627F\u8BFA\u4E00\u76F4\u505C\u5728\u8FB9\u7F18\uFF0C\u8BA9\u51B3\u5B9A\u88AB\u62C6\u6210\u65E0\u5C3D\u7684\u51C6\u5907\u3002",
    question: "\u54EA\u4E00\u6B21\u8BD5\u63A2\u6B63\u5728\u5E2E\u52A9\u4F60\u5B66\u4E60\uFF0C\u54EA\u4E00\u6B21\u53EA\u662F\u5728\u5EF6\u540E\u56DE\u7B54\uFF1F"
  },
  advancing: {
    possibility: "\u6301\u7EED\u63A8\u8FDB\u53EF\u80FD\u8BA9\u6A21\u7CCA\u65B9\u5411\u83B7\u5F97\u5F62\u72B6\uFF0C\u5E76\u4ECE\u884C\u52A8\u7684\u56DE\u58F0\u91CC\u5F62\u6210\u4E0B\u4E00\u6B65\u3002",
    cost: "\u901F\u5EA6\u4E5F\u53EF\u80FD\u906E\u4F4F\u5DF2\u7ECF\u6539\u53D8\u7684\u6761\u4EF6\uFF0C\u8BA9\u65B0\u95EE\u9898\u4ECD\u88AB\u5F53\u4F5C\u65E7\u95EE\u9898\u5904\u7406\u3002",
    question: "\u4F60\u5728\u63A8\u8FDB\u4E00\u4E2A\u65B9\u5411\uFF0C\u8FD8\u662F\u5728\u7528\u901F\u5EA6\u4FDD\u62A4\u90A3\u4E2A\u65B9\u5411\uFF1F"
  }
};
var changedBranches = {
  rhythm: {
    possibility: "\u6539\u53D8\u5FEB\u6162\u4E0E\u505C\u987F\uFF0C\u53EF\u80FD\u8BA9\u539F\u5148\u88AB\u8282\u594F\u63A9\u76D6\u7684\u611F\u53D7\u548C\u7EBF\u7D22\u91CD\u65B0\u53EF\u89C1\u3002",
    cost: "\u65B0\u8282\u594F\u4E5F\u53EF\u80FD\u6253\u65AD\u719F\u7EC3\u79E9\u5E8F\uFF0C\u4F7F\u6548\u7387\u548C\u5B89\u5168\u611F\u77ED\u6682\u5931\u53BB\u539F\u6709\u652F\u70B9\u3002",
    question: "\u4F60\u60F3\u6539\u53D8\u7684\u662F\u65F6\u95F4\uFF0C\u8FD8\u662F\u81EA\u5DF1\u4E0E\u65F6\u95F4\u76F8\u5904\u7684\u65B9\u5F0F\uFF1F"
  },
  direction: {
    possibility: "\u8F6C\u5411\u53EF\u80FD\u6253\u5F00\u539F\u672C\u4E0D\u5728\u89C6\u91CE\u4E2D\u7684\u8DEF\u5F84\uFF0C\u4E5F\u8BA9\u4E00\u4E2A\u65E7\u95EE\u9898\u88AB\u91CD\u65B0\u547D\u540D\u3002",
    cost: "\u6539\u53D8\u65B9\u5411\u4E5F\u53EF\u80FD\u610F\u5473\u7740\u79BB\u5F00\u719F\u6089\u5750\u6807\uFF0C\u627F\u62C5\u5DF2\u6709\u79EF\u7D2F\u65E0\u6CD5\u539F\u6837\u5E26\u8D70\u7684\u7A7A\u7F3A\u3002",
    question: "\u54EA\u4E00\u90E8\u5206\u7684\u4F60\u60F3\u8F6C\u5411\uFF0C\u54EA\u4E00\u90E8\u5206\u4ECD\u5728\u5B88\u4F4F\u539F\u6709\u5750\u6807\uFF1F"
  },
  distance: {
    possibility: "\u8C03\u6574\u4E0E\u4ED6\u4EBA\u7684\u8DDD\u79BB\uFF0C\u53EF\u80FD\u8BA9\u88AB\u5FFD\u7565\u7684\u9700\u8981\u548C\u8FB9\u754C\u83B7\u5F97\u66F4\u6E05\u695A\u7684\u8BED\u8A00\u3002",
    cost: "\u65B0\u7684\u8DDD\u79BB\u4E5F\u53EF\u80FD\u6539\u53D8\u5F7C\u6B64\u719F\u6089\u7684\u89D2\u8272\uFF0C\u9700\u8981\u4E00\u6BB5\u91CD\u65B0\u7406\u89E3\u5173\u7CFB\u7684\u65F6\u95F4\u3002",
    question: "\u4F60\u9700\u8981\u7684\u662F\u66F4\u8FD1\u3001\u66F4\u8FDC\uFF0C\u8FD8\u662F\u4E00\u79CD\u53EF\u4EE5\u81EA\u7531\u79FB\u52A8\u7684\u8DDD\u79BB\uFF1F"
  }
};
function localNarrative(input) {
  return {
    maybeSo: { premise: statePremise[input.answers.state], ...actionBranches[input.answers.action] },
    maybeNot: { premise: "\u5982\u679C\u4F60\u5148\u6539\u53D8\u4E00\u4E2A\u9009\u62E9\uFF0C\u5E76\u8BA9\u5176\u4ED6\u6761\u4EF6\u7EE7\u7EED\u4FDD\u6301\u5F00\u653E\u2026\u2026", ...changedBranches[input.answers.change] },
    confidence: 0.72,
    limitations: ["\u8FD9\u4E24\u6761\u53D9\u4E8B\u4ECE\u89C2\u4F17\u63D0\u4F9B\u7684\u5F53\u4E0B\u524D\u63D0\u51FA\u53D1\uFF0C\u4E0D\u5305\u542B\u6982\u7387\uFF0C\u4E5F\u4E0D\u6784\u6210\u9884\u6D4B\u3002"],
    sourceKind: "fallback"
  };
}
function modelTextIsAllowed(value) {
  const text = JSON.stringify(value);
  return validateReflectionText(text).length === 0 && !/(种族|族裔|性别|疾病|健康|吸引力|人格类型|身份识别)/.test(text);
}

// ../黑客松/server/app.ts
var upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 15e5, files: 1, fields: 3 },
  fileFilter: (_request, file, callback) => callback(null, ["image/jpeg", "image/png", "image/webp"].includes(file.mimetype))
});
function pngBuffer(dataUrl) {
  const buffer = Buffer.from(dataUrl.slice(dataUrl.indexOf(",") + 1), "base64");
  if (buffer.length < 8 || buffer.subarray(1, 4).toString() !== "PNG") throw new Error("invalid png");
  return buffer;
}
function artworkId() {
  return `MSMN-${randomBytes(4).toString("hex").toUpperCase()}`;
}
async function openAiPortrait(client, model, image, summary) {
  const ids = figureEchoes.map((figure2) => figure2.id).join(", ");
  const response = await client.responses.create({
    model,
    input: [{
      role: "user",
      content: [
        {
          type: "input_text",
          text: `\u8FD9\u662F\u827A\u672F\u88C5\u7F6E\u4E2D\u7684\u975E\u8EAB\u4EFD\u89C6\u89C9\u56DE\u58F0\u3002\u53EA\u80FD\u4ECE\u4EE5\u4E0B\u4EBA\u7269\u7F16\u53F7\u9009\u62E9\u4E00\u4F4D\uFF1A${ids}\u3002\u53EA\u63CF\u8FF0\u8F6E\u5ED3\u3001\u7559\u767D\u3001\u660E\u6697\u548C\u6784\u56FE\uFF1B\u7981\u6B62\u63A8\u65AD\u8EAB\u4EFD\u3001\u79CD\u65CF\u3001\u6027\u522B\u3001\u5065\u5EB7\u3001\u5438\u5F15\u529B\u3001\u4EBA\u683C\u6216\u547D\u8FD0\u3002\u51E0\u4F55\u6458\u8981\uFF1A${JSON.stringify(summary)}`
        },
        { type: "input_image", image_url: `data:${image.mimetype};base64,${image.buffer.toString("base64")}`, detail: "low" }
      ]
    }],
    text: { format: { type: "json_schema", name: "portrait_reflection", strict: true, schema: portraitJsonSchema } }
  }, { timeout: 12e3 });
  const parsed = portraitModelSchema.parse(JSON.parse(response.output_text));
  if (!modelTextIsAllowed(parsed)) throw new Error("unsafe portrait response");
  const figure = figureEchoes.find((candidate) => candidate.id === parsed.figureId);
  if (!figure) throw new Error("unknown curated figure");
  return {
    ...figure,
    visualEcho: parsed.visualEcho,
    reflection: parsed.reflection,
    confidence: 0.62,
    limitations: ["\u6A21\u578B\u53EA\u5728\u6709\u9650\u8096\u50CF\u5E93\u4E2D\u9009\u62E9\u89C6\u89C9\u56DE\u58F0\uFF0C\u4E0D\u8FDB\u884C\u8EAB\u4EFD\u8BC6\u522B\uFF0C\u4E5F\u4E0D\u4EE3\u8868\u4EBA\u683C\u6216\u547D\u8FD0\u76F8\u4F3C\u3002"],
    sourceKind: "generated"
  };
}
async function openAiNarrative(client, model, input) {
  const response = await client.responses.create({
    model,
    input: [{
      role: "user",
      content: [{
        type: "input_text",
        text: `\u4E3A\u4E92\u52A8\u827A\u672F\u88C5\u7F6E\u751F\u6210\u4E24\u6761\u5B8C\u5168\u5BF9\u79F0\u7684\u53CD\u601D\u53D9\u4E8B\u3002\u6216\u7136\u5EF6\u7EED\u5F53\u524D\u6A21\u5F0F\uFF0C\u672A\u7136\u6539\u53D8\u4E00\u4E2A\u9009\u62E9\u3002\u6BCF\u6761\u5FC5\u987B\u5305\u542B\u53EF\u80FD\u83B7\u5F97\u3001\u53EF\u80FD\u4EE3\u4EF7\u548C\u5F00\u653E\u53CD\u95EE\uFF1B\u4E0D\u63D0\u4F9B\u6982\u7387\u3001\u8BC4\u5206\u3001\u4EBA\u683C\u5224\u65AD\u6216\u786E\u5B9A\u672A\u6765\uFF1B\u4E0D\u58F0\u79F0\u7B97\u547D\u3002\u6D3E\u751F\u524D\u63D0\uFF1A${JSON.stringify(input)}`
      }]
    }],
    text: { format: { type: "json_schema", name: "narrative_reflection", strict: true, schema: narrativeJsonSchema } }
  }, { timeout: 12e3 });
  const parsed = narrativeResponseSchema.parse(JSON.parse(response.output_text));
  if (!modelTextIsAllowed(parsed)) throw new Error("unsafe narrative response");
  return {
    ...parsed,
    confidence: 0.66,
    limitations: ["\u751F\u6210\u53D9\u4E8B\u53EA\u5EF6\u4F38\u89C2\u4F17\u4E3B\u52A8\u63D0\u4F9B\u7684\u524D\u63D0\uFF0C\u4E0D\u542B\u6982\u7387\uFF0C\u4E5F\u4E0D\u6784\u6210\u9884\u6D4B\u3002"],
    sourceKind: "generated"
  };
}
function createOracleServer(options) {
  const app2 = express();
  const archiveDir = resolve(options.archiveDir);
  const client = options.openaiKey && options.openaiModel ? new OpenAI({ apiKey: options.openaiKey }) : null;
  app2.disable("x-powered-by");
  app2.use("/api", express.json({ limit: "16mb", strict: true }));
  app2.get("/api/health", (_request, response) => {
    response.json({
      ok: true,
      exhibitionId: options.exhibitionId,
      modelEnabled: Boolean(client),
      deepSeekEnabled: Boolean(options.deepSeekKey)
    });
  });
  app2.post("/api/portrait-reflection", upload.single("portrait"), async (request, response) => {
    try {
      if (request.body.consent !== "true") return response.status(403).json({ error: "\u672A\u53D6\u5F97\u6B63\u9762\u88C1\u56FE\u4E91\u7AEF\u5206\u6790\u6388\u6743\u3002" });
      if (!request.file) return response.status(400).json({ error: "\u9700\u8981\u4E00\u5F20\u53D7\u652F\u6301\u7684\u6B63\u9762\u88C1\u56FE\u3002" });
      const summary = visualSummarySchema.parse(JSON.parse(String(request.body.summary ?? "{}")));
      const consentVersion = String(request.body.consentVersion ?? "");
      if (!consentVersion) return response.status(400).json({ error: "\u7F3A\u5C11\u6388\u6743\u7248\u672C\u3002" });
      if (!client || !options.openaiModel) return response.json(localFigureEcho(summary));
      try {
        return response.json(await openAiPortrait(client, options.openaiModel, request.file, summary));
      } catch {
        return response.json(localFigureEcho(summary));
      }
    } catch {
      return response.status(400).json({ error: "\u6B63\u9762\u88C1\u56FE\u6216\u51E0\u4F55\u6458\u8981\u683C\u5F0F\u4E0D\u6B63\u786E\u3002" });
    }
  });
  app2.post("/api/narrative-reflection", async (request, response) => {
    const parsed = narrativeRequestSchema.safeParse(request.body);
    if (!parsed.success) return response.status(400).json({ error: "\u53EA\u63A5\u53D7\u6D3E\u751F\u8C61\u5F81\u3001\u60C5\u5883\u4E0E\u4E3B\u52A8\u9009\u62E9\u3002" });
    if (!client || !options.openaiModel) return response.json(localNarrative(parsed.data));
    try {
      return response.json(await openAiNarrative(client, options.openaiModel, parsed.data));
    } catch {
      return response.json(localNarrative(parsed.data));
    }
  });
  app2.post("/api/destiny/grounded-reading", async (request, response) => {
    const parsed = deepSeekReadingRequestSchema.safeParse(request.body);
    if (!parsed.success) {
      return response.status(400).json({ error: "\u53EA\u63A5\u53D7\u6D3E\u751F\u8BC1\u636E\u3001\u5DF2\u767B\u8BB0\u53C2\u8003\u8282\u9009\u548C\u89C2\u4F17\u4E3B\u52A8\u9009\u62E9\u3002" });
    }
    if (!options.deepSeekKey) {
      return response.status(503).json({ error: "DeepSeek \u5C1A\u672A\u5728\u672C\u673A\u5C55\u573A\u670D\u52A1\u4E2D\u914D\u7F6E\u3002" });
    }
    try {
      return response.json(await requestGroundedReading(parsed.data, {
        apiKey: options.deepSeekKey,
        model: options.deepSeekModel,
        baseUrl: options.deepSeekBaseUrl
      }));
    } catch (error) {
      const reason = error instanceof DeepSeekGatewayError ? error.code : "unknown";
      return response.status(502).json({ error: "DeepSeek \u672A\u80FD\u8FD4\u56DE\u7B26\u5408\u6765\u6E90\u7EA6\u675F\u7684\u5185\u5BB9\u3002", reason });
    }
  });
  app2.post("/api/destiny/modern-reading", async (request, response) => {
    const parsed = modernReadingRequestSchema.safeParse(request.body);
    if (!parsed.success) {
      return response.status(400).json({ error: "\u53EA\u63A5\u53D7\u7D2F\u8BA1\u6570\u503C\u8BC1\u636E\u3001\u767B\u8BB0\u7814\u7A76\u548C\u89C2\u4F17\u4E3B\u52A8\u9009\u62E9\u3002" });
    }
    if (!options.deepSeekKey) {
      return response.status(503).json({ error: "DeepSeek \u5C1A\u672A\u5728\u672C\u673A\u5C55\u573A\u670D\u52A1\u4E2D\u914D\u7F6E\u3002" });
    }
    try {
      return response.json(await requestModernReading(parsed.data, {
        apiKey: options.deepSeekKey,
        model: options.deepSeekModel,
        baseUrl: options.deepSeekBaseUrl
      }));
    } catch (error) {
      const reason = error instanceof DeepSeekGatewayError ? error.code : "unknown";
      return response.status(502).json({ error: "DeepSeek \u672A\u80FD\u8FD4\u56DE\u7B26\u5408\u89C2\u5BDF\u8FB9\u754C\u7684\u5185\u5BB9\u3002", reason });
    }
  });
  app2.post("/api/destiny/guardian-match", async (request, response) => {
    const parsed = guardianMatchRequestSchema.safeParse(request.body);
    if (!parsed.success) {
      return response.status(400).json({ error: "\u53EA\u63A5\u53D7\u89C2\u4F17\u4E3B\u52A8\u9009\u62E9\u7684\u767B\u8BB0\u63CF\u8FF0\u4E0E\u53EF\u9009\u4E3B\u661F\u7F16\u53F7\u3002" });
    }
    if (!options.deepSeekKey) {
      return response.status(503).json({ error: "DeepSeek \u5C1A\u672A\u5728\u672C\u673A\u5C55\u573A\u670D\u52A1\u4E2D\u914D\u7F6E\u3002" });
    }
    try {
      return response.json(await requestGuardianMatch(parsed.data, {
        apiKey: options.deepSeekKey,
        model: options.deepSeekModel,
        baseUrl: options.deepSeekBaseUrl
      }));
    } catch (error) {
      const reason = error instanceof DeepSeekGatewayError ? error.code : "unknown";
      return response.status(502).json({ error: "DeepSeek \u672A\u80FD\u8FD4\u56DE\u767B\u8BB0\u76EE\u5F55\u5185\u7684\u5B88\u62A4\u795E\u3002", reason });
    }
  });
  app2.post("/api/destiny/guardian-dialogue", async (request, response) => {
    const parsed = guardianDialogueRequestSchema.safeParse(request.body);
    if (!parsed.success) {
      return response.status(400).json({ error: "\u53EA\u63A5\u53D7\u56FA\u5B9A\u5B88\u62A4\u795E\u3001\u5F53\u524D\u95EE\u9898\u4E0E\u672C\u6B21\u4E3B\u52A8\u9009\u62E9\u3002" });
    }
    if (!options.deepSeekKey) {
      return response.status(503).json({ error: "DeepSeek \u5C1A\u672A\u5728\u672C\u673A\u5C55\u573A\u670D\u52A1\u4E2D\u914D\u7F6E\u3002" });
    }
    try {
      return response.json(await requestGuardianDialogue(parsed.data, {
        apiKey: options.deepSeekKey,
        model: options.deepSeekModel,
        baseUrl: options.deepSeekBaseUrl
      }));
    } catch (error) {
      const reason = error instanceof DeepSeekGatewayError ? error.code : "unknown";
      return response.status(502).json({ error: "\u5B88\u62A4\u795E\u6B64\u523B\u6CA1\u6709\u8FD4\u56DE\u7B26\u5408\u8FB9\u754C\u7684\u56DE\u7B54\u3002", reason });
    }
  });
  app2.post("/api/archive", async (request, response) => {
    const parsed = archiveRequestSchema.safeParse(request.body);
    if (!parsed.success) {
      const consentDenied = request.body && request.body.consent === false;
      return response.status(consentDenied ? 403 : 400).json({ error: consentDenied ? "\u672A\u53D6\u5F97\u672C\u5730\u7559\u5F71\u4E8C\u6B21\u540C\u610F\u3002" : "\u7559\u5F71\u683C\u5F0F\u4E0D\u6B63\u786E\u3002" });
    }
    try {
      const png = pngBuffer(parsed.data.artworkPng);
      const id = artworkId();
      await mkdir(archiveDir, { recursive: true });
      await writeFile(join(archiveDir, `${id}.png`), png, { flag: "wx" });
      return response.status(201).json({ artworkId: id });
    } catch {
      return response.status(400).json({ error: "\u827A\u672F\u5316 PNG \u65E0\u6CD5\u4FDD\u5B58\u3002" });
    }
  });
  app2.delete("/api/archive/:artworkId", async (request, response) => {
    if (!/^MSMN-[A-Z0-9]{8}$/.test(request.params.artworkId)) return response.status(400).json({ error: "\u4F5C\u54C1\u7F16\u53F7\u683C\u5F0F\u4E0D\u6B63\u786E\u3002" });
    await unlink(join(archiveDir, `${request.params.artworkId}.png`)).catch(() => void 0);
    return response.status(204).end();
  });
  if (options.distDir) {
    const distDir2 = resolve(options.distDir);
    app2.use(express.static(distDir2, { index: false }));
    app2.use((request, response, next) => {
      if (request.method !== "GET" || request.path.startsWith("/api/")) return next();
      return response.sendFile(join(distDir2, "index.html"));
    });
  }
  app2.use((error, _request, response, _next) => {
    if (error instanceof multer.MulterError) return response.status(413).json({ error: "\u56FE\u50CF\u8D85\u8FC7\u5C55\u9879\u5141\u8BB8\u5927\u5C0F\u3002" });
    return response.status(500).json({ error: "\u672C\u5730\u670D\u52A1\u6682\u65F6\u65E0\u6CD5\u5B8C\u6210\u8BF7\u6C42\u3002" });
  });
  return app2;
}

// _server-entry.ts
var port = Number(process.env.PORT ?? 4180);
var host = process.env.HOST ?? "0.0.0.0";
var distDir = resolve2("dist");
var app = createOracleServer({
  archiveDir: process.env.ARCHIVE_DIR ?? resolve2("archive"),
  exhibitionId: process.env.EXHIBITION_ID ?? "zhaojian-public",
  openaiKey: process.env.OPENAI_API_KEY,
  openaiModel: process.env.OPENAI_MODEL,
  deepSeekKey: process.env.DEEPSEEK_API_KEY,
  deepSeekModel: process.env.DEEPSEEK_MODEL,
  deepSeekBaseUrl: process.env.DEEPSEEK_BASE_URL
});
app.get("/", (request, response, next) => {
  if (Object.keys(request.query).length > 0) return next();
  return response.redirect(302, "/?destiny=1");
});
app.use(express2.static(distDir, { index: false }));
app.use((request, response, next) => {
  if (request.method !== "GET" || request.path.startsWith("/api/")) return next();
  return response.sendFile(join2(distDir, "index.html"));
});
app.listen(port, host, () => {
  process.stdout.write(`\u7167\u89C1\u5B9E\u9A8C\u573A\u5DF2\u542F\u52A8\uFF1Ahttp://${host}:${port}/?destiny=1
`);
});

#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const assert = require('assert');

const ROOT = path.join(__dirname, '..');
const levels = JSON.parse(fs.readFileSync(path.join(ROOT, 'web', 'assets', 'maps', 'levels.json'), 'utf8'));

function isBiwuOrDuobao(l) {
  if (!l) return false;
  const cat = l.category || '';
  const mode = l.mode || '';
  const name = l.name || '';
  return cat.includes('比武') || cat.includes('夺宝') ||
         mode.includes('比武') || mode.includes('夺宝') ||
         name.includes('比武') || name.includes('夺宝');
}

function isBunLevel(l) {
  return !!(l && (l.bun || l.native_rule === 3 || l.category === '抢包子' || l.mode === '抢包山(bun)'));
}

function defaultLevelHp(l) {
  if (isBunLevel(l)) return 1;
  return isBiwuOrDuobao(l) ? 5 : 1;
}

console.log('=== 开始测试地图默认初始血量逻辑 ===\n');

// 1. 验证比武/夺宝地图分类
const biwuCount = levels.filter(isBiwuOrDuobao).length;
const normalCount = levels.filter(l => !isBiwuOrDuobao(l)).length;
assert.strictEqual(biwuCount, 51, `比武夺宝地图数量应为 51，实际 ${biwuCount}`);
assert.strictEqual(normalCount, 191, `其他地图数量应为 191，实际 ${normalCount}`);
console.log(`✓ 51 张比武/夺宝地图 + 191 张其他地图分类准确判定通过`);

// 2. 验证各个典型地图的默认血量
const desert01 = levels.find(l => l.source === 'desert01_4.map');
assert.strictEqual(defaultLevelHp(desert01), 1, '沙漠01 默认血量应为 1');

const contest01 = levels.find(l => l.source === 'contest01_8.map');
assert.strictEqual(defaultLevelHp(contest01), 5, '比赛01 默认血量应为 5');

const match01 = levels.find(l => l.source === 'match01_2.map');
assert.strictEqual(defaultLevelHp(match01), 5, '比武01 默认血量应为 5');

const treasure01 = levels.find(l => l.source === 'treasure01_4.map');
assert.strictEqual(defaultLevelHp(treasure01), 5, '夺宝01 默认血量应为 5');

const city01 = levels.find(l => l.source === 'town01_4.map');
assert.strictEqual(defaultLevelHp(city01), 1, '城镇01 默认血量应为 1');

const box01 = levels.find(l => l.source === 'box01_8.map');
assert.strictEqual(defaultLevelHp(box01), 1, '推箱子01 默认血量应为 1');

const bun06 = levels.find(l => l.qqt_id === 806);
assert.strictEqual(defaultLevelHp(bun06), 1, '抢包子06 默认血量应为 1');

console.log('✓ 典型地图默认血量映射全部通过（抢包子/沙漠/城镇/推箱子=1血，比赛/比武/夺宝=5血）');
console.log('\n所有地图默认血量单元测试全部通过 ✔');

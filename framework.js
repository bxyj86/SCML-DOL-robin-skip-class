(function () {
  'use strict';
  const KEY = 'robinSkipClass';

  function initV() {
    try {
      V[KEY] = V[KEY] || {};
      if (V[KEY].lastDay === undefined) V[KEY].lastDay = -1;
      if (V[KEY].active === undefined) V[KEY].active = false;
      if (V[KEY].leightonChecked === undefined) V[KEY].leightonChecked = false;
      if (V[KEY].leightonFound === undefined) V[KEY].leightonFound = false;
    } catch (e) {}
  }
  window.myModInitV = initV;

  // 罗宾三条件
  window.myModRobinReady = function () {
    const r = C && C.npc && C.npc.Robin;
    if (!r) return false;
    return (r.dom || 0) >= 80 && (r.love || 0) >= 80 && (r.trauma || 0) < 10;
  };

  // 天气判定：是否在下雨
  window.myModWeatherIsRain = function () {
    try {
      if (!Weather) return false;
      if (Weather.precipitation !== 'rain') return false;
      if (Weather.isSnow) return false;
      return (Weather.precipitationIntensity || 0) > 0;
    } catch (e) { return false; }
  };

  // 天气判定：是否在下雪
  window.myModWeatherIsSnow = function () {
    try {
      if (!Weather) return false;
      if (!Weather.isSnow) return false;
      return (Weather.precipitationIntensity || 0) > 0;
    } catch (e) { return false; }
  };

  window.myModShouldShowInvite = function () {
    try {
      if (!V || !C) return false;
      if (V.robinhistory !== 'seat') return false;
      if (V[KEY] && V[KEY].lastDay === Time.day) return false;
      return true;
    } catch (e) { return false; }
  };

  // 六门课全 A（≥700）
  window.myModAllGradesA = function () {
    const subs = ['science', 'maths', 'english', 'history', 'housekeeping', 'swimmingskill'];
    for (let i = 0; i < subs.length; i++) {
      if ((V[subs[i]] || 0) < 700) return false;
    }
    return true;
  };

  // 学校声望
  window.myModSchoolRep = function () {
    return (V && V.fame && V.fame.social) || 0;
  };

  // 六门课全 B 以上（≥400）
  window.myModAllGradesB = function () {
    const subs = ['science', 'maths', 'english', 'history', 'housekeeping', 'swimmingskill'];
    for (let i = 0; i < subs.length; i++) {
      if ((V[subs[i]] || 0) < 400) return false;
    }
    return true;
  };

  // 好学生四条件
  window.myModIsGoodStudent = function () {
    if (!myModAllGradesB()) return false;
    if (myModSchoolRep() <= 160) return false;
    const lle = (C && C.npc && C.npc.Leighton && C.npc.Leighton.love) || 0;
    if (lle <= 50) return false;
    if ((V.delinquency || 0) >= 200) return false;
    return true;
  };

  // 礼顿分级判定
  window.myModCheckLeighton = function () {
    if (myModAllGradesA()) return 'skip';
    if ((V.skulduggery || 0) >= 400) return 'reason';
    if (myModIsGoodStudent()) return 'deal';
    return 'choice';
  };

  // 只做数据初始化，不跳 passage
  window.myModEnterRoof = function () {
    initV();
    V[KEY].lastDay = Time.day;
    V[KEY].active = true;
    V[KEY].leightonChecked = false;
    V[KEY].leightonFound = Math.floor(Math.random() * 100) < 5;
    V[KEY].weatherAtEntry = (Weather && Weather.precipitation) || 'none';
    V[KEY].rainHandled = false;
    V[KEY].interactionsAfter15 = 0;
    try {
      const fromHour = Time.hour;
      const hours = [];
      for (let h = fromHour; h <= 15; h++) hours.push(h);
      setRobinLocationOverride('school', hours);
    } catch (e) {}
  };

  // 贿赂：只扣钱
  window.myModBribeLeighton = function () {
    if ((V.money || 0) < 1000) return false;
    V.money -= 1000;
    V[KEY].leightonChecked = true;
    return true;
  };

  // 认罚：只扣属性
  window.myModAcceptPunishment = function () {
    try {
      const idx = V.NPCNameList.indexOf('Robin');
      if (idx >= 0) {
        const r = V.NPCName[idx];
        r.dom = Math.max(0, (r.dom || 0) - 10);
        r.love = Math.max(0, (r.love || 0) - 1);
      }
      V.detention = (V.detention || 0) + 1;
      V.robinlocationoverride = null;
      V[KEY].active = false;
    } catch (e) {}
  };

  // 聊天
  window.myModRoofChat = function () {
    try {
      const idx = V.NPCNameList.indexOf('Robin');
      if (idx >= 0) {
        const r = V.NPCName[idx];
        r.love = Math.min(100, (r.love || 0) + 3);
        r.dom = Math.min(100, (r.dom || 0) + 1);
      }
    } catch (e) {}
  };

  // 玩游戏
  window.myModRoofPlay = function () {
    try {
      const idx = V.NPCNameList.indexOf('Robin');
      if (idx >= 0) {
        const r = V.NPCName[idx];
        r.love = Math.min(100, (r.love || 0) + 1);
        r.dom = Math.min(100, (r.dom || 0) + 3);
      }
    } catch (e) {}
  };

  // 打雪仗：好感 +2、自信 +2
  window.myModRoofSnowball = function () {
    try {
      const idx = V.NPCNameList.indexOf('Robin');
      if (idx >= 0) {
        const r = V.NPCName[idx];
        r.love = Math.min(100, (r.love || 0) + 2);
        r.dom = Math.min(100, (r.dom || 0) + 2);
      }
    } catch (e) {}
  };

  // ========== 打湿全身 ==========
  window.myModWetAll = function (level) {
    const slots = ['upper','lower','underupper','underlower',
                   'overupper','overlower','head','face','neck',
                   'hands','legs','feet'];
    for (const s of slots) {
      try {
        V[s + 'wet'] = level;
        const stage = level >= 100 ? 3 : level >= 80 ? 2 : level >= 50 ? 1 : 0;
        V[s.replace('_','') + 'wetstage'] = stage;
      } catch (e) {}
    }
  };

  // ========== 雨量分级 ==========
  window.myModRainLevel = function () {
    const pi = (Weather && Weather.precipitationIntensity) || 0;
    if (pi >= 0.7) return 100;
    if (pi >= 0.3) return 80;
    return 50;
  };

  window.myModRainTooHeavy = function () {
    return ((Weather && Weather.precipitationIntensity) || 0) >= 0.7;
  };

  // ========== 变天检测 ==========
  window.myModWeatherChangedToRain = function () {
    try {
      const atEntry = (V[KEY] && V[KEY].weatherAtEntry) || 'none';
      const now = (Weather && Weather.precipitation) || 'none';
      const intensity = (Weather && Weather.precipitationIntensity) || 0;
      const handled = V[KEY] && V[KEY].rainHandled;
      return atEntry !== 'rain' && now === 'rain' && intensity > 0 && !handled;
    } catch (e) { return false; }
  };

  window.myModMarkRainHandled = function () {
    if (V[KEY]) V[KEY].rainHandled = true;
  };

  // ========== 互动计数（仅 15 点后） ==========
  window.myModCountInteraction = function () {
    if (!V[KEY]) return;
    if (Time.hour >= 15) {
      V[KEY].interactionsAfter15 = (V[KEY].interactionsAfter15 || 0) + 1;
    }
  };

  window.myModMustGoHome = function () {
    try {
      return Time.hour >= 15 && ((V[KEY] && V[KEY].interactionsAfter15) || 0) >= 3;
    } catch (e) { return false; }
  };

  // ========== 拥抱：love +3、lust +1、dom +1、trauma -3 ==========
  window.myModRoofHug = function () {
    try {
      const idx = V.NPCNameList.indexOf('Robin');
      if (idx >= 0) {
        const r = V.NPCName[idx];
        r.love = Math.min(100, (r.love || 0) + 3);
        r.lust = Math.min(100, (r.lust || 0) + 1);
        r.dom = Math.min(100, (r.dom || 0) + 1);
        r.trauma = Math.max(0, (r.trauma || 0) - 3);
      }
    } catch (e) {}
  };

  // 离开楼顶：只清状态
  window.myModLeaveRoof = function () {
    V[KEY].active = false;
    V.robinlocationoverride = null;
  };

  // 一起回家：只清状态
  window.myModGoHomeTogether = function () {
    V[KEY].active = false;
    V.robinlocationoverride = null;
  };

  // 到家后最终清状态
  window.myModArriveHome = function () {
    V[KEY].active = false;
    V.robinlocationoverride = null;
  };

  if (typeof maplebirch !== 'undefined') {
    maplebirch.on(':storyready', initV);
    maplebirch.on(':onLoad', initV);
  }
})();

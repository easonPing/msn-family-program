// Remote API base path for Netlify functions.  All user and survey
// operations are proxied through serverless functions that talk to
// Supabase.  Each function resides at `/.netlify/functions/<name>`.
const API_BASE = '/.netlify/functions';

/**
 * Register a new user via the Netlify function.
 * Returns an object with either `{ success: true }` or `{ error: '...' }`.
 */
async function registerUserRemote(username, password) {
  const res = await fetch(`${API_BASE}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });
  try {
    const data = await res.json();
    if (!res.ok) {
      // wrap error message into error property
      return { error: data.error || '注册失败' };
    }
    return data;
  } catch (e) {
    return { error: '请求失败，请稍后再试' };
  }
}

/**
 * Authenticate a user via the Netlify function.
 * Returns `{ success: true }` on success or `{ error: '...' }` on failure.
 */
async function loginUserRemote(username, password) {
  const res = await fetch(`${API_BASE}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });
  try {
    const data = await res.json();
    if (!res.ok) {
      return { error: data.error || '登录失败' };
    }
    return data;
  } catch (e) {
    return { error: '请求失败，请稍后再试' };
  }
}

/**
 * Submit survey answers via the Netlify function.
 * Returns `{ success: true }` or an error object.
 */
async function submitSurveyRemote(username, answers) {
  const res = await fetch(`${API_BASE}/submit-survey`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, answers })
  });
  try {
    const data = await res.json();
    if (!res.ok) {
      return { error: data.error || '提交失败' };
    }
    return data;
  } catch (e) {
    return { error: '请求失败，请稍后再试' };
  }
}


// Show second modal when clicking on the first cover image
function showSecondModal() {
  const modal1 = document.getElementById('introModal1');
  const modal2 = document.getElementById('introModal2');
  if (modal1) modal1.classList.add('hidden');
  if (modal2) modal2.classList.remove('hidden');
}

// Close second modal and show authentication container
function closeSecondModal() {
  const modal2 = document.getElementById('introModal2');
  if (modal2) modal2.classList.add('hidden');
  document.getElementById('authContainer').classList.remove('hidden');
}

// Switch between login and register forms
function switchAuthTab(tab) {
  const loginTab = document.getElementById('loginTab');
  const registerTab = document.getElementById('registerTab');
  const loginForm = document.getElementById('loginForm');
  const registerForm = document.getElementById('registerForm');
  if (tab === 'login') {
    loginTab.classList.add('active');
    registerTab.classList.remove('active');
    loginForm.classList.remove('hidden');
    registerForm.classList.add('hidden');
  } else {
    registerTab.classList.add('active');
    loginTab.classList.remove('active');
    registerForm.classList.remove('hidden');
    loginForm.classList.add('hidden');
  }
}

// Render survey questions dynamically
function renderSurveyQuestions() {
  const surveyForm = document.getElementById('surveyForm');
  surveyForm.innerHTML = '';
  const questions = [
    {
      id: 1,
      text: '1. 课余时间，你更喜欢通过以下哪种方式打发时间：',
      type: 'radio',
      options: {
        'A': '去健身或运动一下',
        'B': '跟朋友一起找家餐厅吃饭',
        'C': '去跳舞教室跳一小时',
        'D': '在家上网买steam游戏开黑'
      }
    },
    {
      id: 2,
      text: '2. 你更喜欢哪种类型的音乐：',
      type: 'radio',
      options: {
        'A': '流行',
        'B': '轻音乐',
        'C': 'Kpop',
        'D': '嘻哈/说唱'
      }
    },
    {
      id: 3,
      text: '3. 你更喜欢待在哪种地方：',
      type: 'radio',
      options: {
        'A': '热闹的party',
        'B': '一个人在房间独处',
        'C': '户外公园',
        'D': '街头的咖啡店'
      }
    },
    {
      id: 4,
      text: '4. 你在群体中更倾向扮演什么角色：',
      type: 'radio',
      options: {
        'A': '领头的羊',
        'B': '远见的鹰',
        'C': '敏捷的豹',
        'D': '善战的狼'
      }
    },
    {
      id: 5,
      text: '5. 你更希望尝试哪种新的活动：',
      type: 'radio',
      options: {
        'A': '桌游',
        'B': '烹饪',
        'C': '体育',
        'D': '舞蹈'
      }
    },
    {
      id: 6,
      text: '6. 你觉得自己最闪光的特点是：',
      type: 'radio',
      options: {
        'A': '组织能力和行动力',
        'B': '烹饪技能和审美敏感',
        'C': '节奏感和表现力',
        'D': '信息搜集与优化生活方式的能力'
      }
    },
    {
      id: 7,
      text: '7. 你更想要学会哪种新技能：',
      type: 'radio',
      options: {
        'A': '新的语种',
        'B': '一项运动',
        'C': '一种艺术（例如摄影，DIY）',
        'D': '一个生活技能'
      }
    },
    {
      id: 8,
      text: '8. 周五的晚上你更想要做什么：',
      type: 'radio',
      options: {
        'A': '和朋友小酌',
        'B': '去gym练到趴',
        'C': '一本好书或一部电影，和无人打扰的清闲',
        'D': 'K歌到半夜'
      }
    },
    {
      id: 9,
      text: '9. 你手机里最多的APP类型是：',
      type: 'radio',
      options: {
        'A': '音乐/运动记录类',
        'B': '美食探店/做菜类',
        'C': '舞蹈剪辑/Kpop社区',
        'D': 'Steam/购物/社交娱乐类'
      }
    },
    {
      id: 10,
      text: '10. 你的朋友觉得你是个什么样的人：',
      type: 'radio',
      options: {
        'A': '活力运动型，全能社交选手',
        'B': '烹饪达人 + 吃喝开心果',
        'C': '爱跳爱唱+热爱舞台的人',
        'D': '什么都懂一点的生活小百科'
      }
    },
    {
      id: 11,
      text: '11. 下面哪句话最符合你的座右铭：',
      type: 'radio',
      options: {
        'A': '“生活就要有节奏和律动”',
        'B': '“吃饱才有力气搞事”',
        'C': '“跳舞不止是爱好，是热情的表达”',
        'D': '“聪明地生活才能玩得更开心”'
      }
    },
    {
      id: 12,
      text: '12. 你和哪种颜色最有共鸣：',
      type: 'radio',
      options: {
        'A': '活力跳跃的多巴胺',
        'B': '平静柔和的浅色系',
        'C': '自然/户外的色调',
        'D': '单色或中性'
      }
    },
    {
      id: 13,
      text: '13. 如果可以时空穿越，你最想和谁见面：',
      type: 'radio',
      options: {
        'A': '一位创造历史的伟人',
        'B': '曾经的朋友',
        'C': '虚拟世界的挚友',
        'D': '原始部落'
      }
    },
    {
      id: 14,
      text: '14. 如果只能带一样东西搬进新家，你会带：',
      type: 'radio',
      options: {
        'A': '调酒工具',
        'B': '炒锅和调料套装',
        'C': '音响',
        'D': '游戏机'
      }
    },
    {
      id: 15,
      text: '15. 加入Family Program，你希望和家人们做这些事情（多选）：',
      type: 'checkbox',
      options: {
        'A': '烹饪/做甜点，拿捏溅起的油花，复刻家里的味道！',
        'B': '健身/打球，重塑健康的身体，做球场上的将军！',
        'C': '跳舞，感受律动的美妙，伴随鼓点的起伏！',
        'D': '探店，打卡角落里的惊喜，常驻UVA大众点评！',
        'E': '桌游/扑克，用牌局上的热情，打出生活的天王炸！',
        'F': '欣赏/创作音乐，让旋律在心尖起舞，让艺术在指尖跳跃！',
        'G': 'K歌，激活话筒，让大脑开机，唱它个三天三夜！',
        'H': '游戏/电竞，手速即正义，意识即王道！',
        'I': '小酌，在酒精里找灵感，只为一点点恰到好处的松弛！'
      }
    },
    {
      id: 16,
      text: '16. 你最想去的三个Family是（按排名）：',
      type: 'rank',
      options: {
        'A': 'CC蛋炒饭',
        'B': 'MAScara',
        'C': '快乐无限大本营',
        'D': '落日派对'
      }
    }
  ];

  questions.forEach(q => {
    const qDiv = document.createElement('div');
    qDiv.className = 'survey-question';
    const qTitle = document.createElement('h3');
    qTitle.textContent = q.text;
    qDiv.appendChild(qTitle);
    if (q.type === 'radio' || q.type === 'checkbox') {
      const optionsDiv = document.createElement('div');
      optionsDiv.className = 'options';
      for (const key in q.options) {
        const optionDiv = document.createElement('div');
        optionDiv.className = 'option-item';
        const input = document.createElement('input');
        input.type = q.type;
        input.name = 'q' + q.id;
        input.value = key;
        input.id = 'q' + q.id + '_' + key;
        const label = document.createElement('label');
        label.setAttribute('for', input.id);
        label.textContent = key + '. ' + q.options[key];
        optionDiv.appendChild(input);
        optionDiv.appendChild(label);
        optionsDiv.appendChild(optionDiv);
      }
      qDiv.appendChild(optionsDiv);
    } else if (q.type === 'rank') {
      const rankContainer = document.createElement('div');
      rankContainer.className = 'options';
      // Create three selects for ranking
      for (let i = 1; i <= 3; i++) {
        const select = document.createElement('select');
        select.id = 'q' + q.id + '_rank' + i;
        // First empty option
        const emptyOpt = document.createElement('option');
        emptyOpt.value = '';
        emptyOpt.textContent = '选择第' + i + '名';
        select.appendChild(emptyOpt);
        for (const key in q.options) {
          const opt = document.createElement('option');
          opt.value = key;
          opt.textContent = key + '. ' + q.options[key];
          select.appendChild(opt);
        }
        rankContainer.appendChild(select);
      }
      qDiv.appendChild(rankContainer);
    }
    surveyForm.appendChild(qDiv);
  });
}

// Submit survey handler
function submitSurvey() {
  const currentUser = sessionStorage.getItem('currentUser');
  if (!currentUser) {
    alert('请先登录。');
    return;
  }
  const responses = {};
  let valid = true;
  const messageEl = document.getElementById('surveyMessage');
  messageEl.textContent = '';
  // Loop through questions 1-15
  for (let q = 1; q <= 15; q++) {
    if (q === 15) {
      // checkbox question
      const inputs = document.querySelectorAll('input[name="q15"]:checked');
      const values = Array.from(inputs).map(i => i.value);
      if (values.length === 0) {
        valid = false;
        messageEl.textContent = '请完成所有题目后提交。';
        break;
      }
      responses['q' + q] = values;
    } else {
      const selected = document.querySelector('input[name="q' + q + '"]:checked');
      if (!selected) {
        valid = false;
        messageEl.textContent = '请完成所有题目后提交。';
        break;
      }
      responses['q' + q] = selected.value;
    }
  }
  // Handle ranking question if previous valid
  if (valid) {
    const ranks = [];
    for (let i = 1; i <= 3; i++) {
      const select = document.getElementById('q16_rank' + i);
      const val = select ? select.value : '';
      if (!val) {
        valid = false;
        messageEl.textContent = '请选择你想去的三个Family的排名。';
        break;
      }
      ranks.push(val);
    }
    // Check for duplicate selections
    const uniqueRanks = new Set(ranks);
    if (valid && uniqueRanks.size !== ranks.length) {
      valid = false;
      messageEl.textContent = '请不要在三个排名中选择相同的Family。';
    }
    if (valid) {
      responses['q16'] = ranks;
    }
  }
  if (!valid) {
    return;
  }
  // Persist response to Supabase via Netlify function
  submitSurveyRemote(currentUser, responses).then((result) => {
    if (result.error) {
      messageEl.style.color = '#c52d2f';
      messageEl.textContent = result.error;
    } else {
      // Reset form
      document.getElementById('surveyForm').reset();
      messageEl.style.color = '#2a7b3f';
      messageEl.textContent = '感谢您的填写！';
    }
  });
}

// Event listeners after DOM loaded
window.addEventListener('DOMContentLoaded', () => {
  // First modal click to transition to second modal
  const intro1 = document.getElementById('introModal1');
  if (intro1) {
    intro1.addEventListener('click', showSecondModal);
  }
  // Second modal enter button
  const enterBtn = document.getElementById('enterSiteButton');
  if (enterBtn) {
    enterBtn.addEventListener('click', closeSecondModal);
  }
  // Auth tabs
  document.getElementById('loginTab').addEventListener('click', () => switchAuthTab('login'));
  document.getElementById('registerTab').addEventListener('click', () => switchAuthTab('register'));
  // Login action: call remote login
  document.getElementById('loginButton').addEventListener('click', () => {
    const username = document.getElementById('loginUsername').value.trim();
    const password = document.getElementById('loginPassword').value;
    const messageEl = document.getElementById('loginMessage');
    messageEl.style.color = '#c52d2f';
    if (!username || !password) {
      messageEl.textContent = '请输入账号和密码。';
      return;
    }
    loginUserRemote(username, password).then((result) => {
      if (result.error) {
        messageEl.textContent = result.error;
        return;
      }
      // Login success
      sessionStorage.setItem('currentUser', username);
      messageEl.textContent = '';
      document.getElementById('authContainer').classList.add('hidden');
      document.getElementById('surveyContainer').classList.remove('hidden');
      // Show admin link if admin
      if (username.toLowerCase() === 'admin' || username === '管理员' || username.toLowerCase().includes('admin')) {
        document.getElementById('adminLink').classList.remove('hidden');
      }
      renderSurveyQuestions();
    });
  });
  // Register action: call remote register
  document.getElementById('registerButton').addEventListener('click', () => {
    const username = document.getElementById('registerUsername').value.trim();
    const password = document.getElementById('registerPassword').value;
    const messageEl = document.getElementById('registerMessage');
    messageEl.style.color = '#c52d2f';
    if (!username || !password) {
      messageEl.textContent = '请输入账号和密码。';
      return;
    }
    // Validate format 姓名-ID (must contain '-')
    if (!/^[^\-]+\-[^\-]+$/.test(username)) {
      messageEl.textContent = '账号格式应为“姓名-ID”。';
      return;
    }
    registerUserRemote(username, password).then((result) => {
      if (result.error) {
        messageEl.textContent = result.error;
        return;
      }
      messageEl.style.color = '#2a7b3f';
      messageEl.textContent = '注册成功，请前往登录。';
      switchAuthTab('login');
    });
  });
  // Submit survey
  document.getElementById('submitSurveyButton').addEventListener('click', submitSurvey);
});
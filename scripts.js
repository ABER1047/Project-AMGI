document.getElementById('start-btn').addEventListener('click', startQuiz);
document.getElementById('japanese-words-btn').addEventListener('click', loadJapaneseWords);

let words = [];
let correctCount = 0;
let usedIndexes = new Set();

async function startQuiz() {
  const input = document.getElementById('word-input').value.trim();
  if (!input) return alert('단어와 뜻을 입력하세요.');

  let lines = input.includes('\n') 
    ? input.split('\n').map(line => line.trim()) 
    : input.split(/\s+/);

  const validPairs = [];
  for (let i = 0; i < lines.length; i += 2) {
    const word = lines[i];
    const meaning = lines[i + 1];
    if (word && meaning) {
      validPairs.push({ word, meaning });
    }
  }

  words = removeDuplicates(validPairs);

  if (words.length < 2) return alert('최소 2개의 단어-뜻 쌍이 필요합니다.');

  correctCount = 0;
  usedIndexes.clear();

  // 문제를 랜덤하게 섞음
  words = shuffleArray(words);

  document.getElementById('input-section').style.display = 'none';
  document.getElementById('question-area').style.display = 'block';

  updateStats();
  loadNextQuestion();
}

function removeDuplicates(wordPairs) {
  const wordMap = new Map();

  wordPairs.forEach(pair => {
    const trimmedWord = pair.word.trim();
    const trimmedMeaning = pair.meaning.trim();
    if (!wordMap.has(trimmedWord)) {
      wordMap.set(trimmedWord, trimmedMeaning);
    } else {
      const existingMeaning = wordMap.get(trimmedWord);
      wordMap.set(trimmedWord, `${existingMeaning}, ${trimmedMeaning}`);
    }
  });

  return Array.from(wordMap.entries()).map(([word, meaning]) => ({ word, meaning }));
}

function updateStats() 
{ document.getElementById('progress').style.width = `${(correctCount / words.length) * 100}%`;
}

async function loadNextQuestion() {
  if (usedIndexes.size >= words.length) {
    alert(`정답률 : ${(correctCount / words.length * 100).toFixed(1)}%`);
    resetQuiz();
    return;
  }

  // 무작위 문제를 선택 (이미 사용된 인덱스 제외)
  let randomIndex;
  do {
    randomIndex = Math.floor(Math.random() * words.length);
  } while (usedIndexes.has(randomIndex));
  usedIndexes.add(randomIndex);

  const currentQuestion = words[randomIndex];
  const question = currentQuestion.word; // 문제는 단어만
  const correctAnswer = currentQuestion.meaning; // 정답은 뜻

  const choices = generateChoices(currentQuestion.word);
  renderQuestion(question, choices, correctAnswer);
}

function generateChoices(correctWord) {
  const choicesCount = parseInt(document.getElementById('choices-count').value, 10);

  if (words.length < choicesCount) {
    alert(`단어 수가 선택지 수(${choicesCount})보다 적습니다. 단어를 더 입력하세요.`);
    resetQuiz();
    return [];
  }

  const correctMeaning = words.find(pair => pair.word === correctWord)?.meaning;
  const choices = new Set([correctMeaning]);

  while (choices.size < choicesCount) {
    const randomItem = words[Math.floor(Math.random() * words.length)];
    if (randomItem.word !== correctWord) {
      choices.add(randomItem.meaning); // 다른 단어의 뜻을 선택지로 추가
    }
  }

  return shuffleArray([...choices]);
}

function renderQuestion(question, choices, correctAnswer) {
  document.getElementById('question').innerText = question;

  const choicesContainer = document.getElementById('choices');
  const fragment = document.createDocumentFragment();

  choices.forEach(choice => {
    const button = document.createElement('button');
    button.className = 'choice';
    button.innerText = choice;
    button.addEventListener('click', () => handleAnswer(button, choice, correctAnswer));
    fragment.appendChild(button);
  });

  choicesContainer.innerHTML = '';
  choicesContainer.appendChild(fragment);
}

function handleAnswer(button, selectedAnswer, correctAnswer) {
  if (selectedAnswer === correctAnswer) {
    correctCount++;
    button.classList.add('correct');
  } else {
    button.classList.add('incorrect');
    alert(`틀렸습니다!\n정답 : ${correctAnswer}`);
  }

  updateStats();
  setTimeout(loadNextQuestion, 1000);
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function resetQuiz() {
  document.getElementById('input-section').style.display = 'block';
  document.getElementById('question-area').style.display = 'none';
  document.getElementById('word-input').value = '';
  document.getElementById('choices').innerHTML = '';
  document.getElementById('progress').style.width = '0%';
}




function loadJapaneseWords() {
  const japaneseWords = 
`安定 안정 移動 이동 一致 일치 一般 일반 違反 위반 影響력 영향력 延期 연기 演技 연기 演習 연습 応対 응대 応用 응용 温暖 온난 温厚 온후 化学 화학 改善 개선 解釈 해석 価値観 가치관 活気 활기 活用 활용 完全 완전 簡単 간단 寒冷 한랭 観客 관객 観察 관찰 完了 완료 記憶 기억 機械 기계 基準 기준 記述 기술 疑問点 의문점 競技 경기 共通 공통 経度 경도 契約 계약 検討 검토 懸命 현명 建設 건설 原則 원칙 現象 현상 源泉 원천 限定 한정 高価 고가 合図 신호 洪水 홍수 効用 효용 国籍 국적 国民 국민 最大 최대 最新最新 최신 小型 소형 初歩 초보 承知 승낙 上級 상급 消防 소방 条件 조건 情熱 열정 常識 상식 人材 인재 人種 인종 成功 성공 訴訟 소송 相続 상속 体積 체적 代表 대표 段階 단계 担当 담당 短所 단점 長所 장점 提出 제출 適用 적용 適応 적응 転職 전직 電流 전류 登録 등록 独自 독자 特定 특정 入学 입학 入浴 입욕 農業 농업 販売 판매 比較 비교 非常 비상 不便 불편 副作用 부작용 部分 부분 平和 평화 保護 보호 報道 보도 放置 방치 包装 포장 暴力 폭력 満足 만족 明確 명확 輸出 수출 有効 유효 友情 우정 用途 용도 利用 이용 領域 영역 零点 영점 労働 노동 試験 시험 満員 만원 雰囲気 분위기 標準 표준 成分 성분 通常 통상 気分 기분 安全 안전 期待 기대 笑顔 웃는얼굴 家族 가족 感謝 감사 危険 위험 意見 의견 友達 친구 旅行 여행 習慣 습관 自然 자연 必要 필요 約束 약속 準備 준비 健康 건강 目的 목적 結果 결과 会話 회화 卒業 졸업 宿題 숙제 知識 지식 努力 노력 運転 운전 関係 관계 仕事 일 文化 문화 確認 확인 重要 중요 生活 생활 社会 사회 予定 예정 感動 감동 景色 경치 経済 경제 夢中 열중 失敗 실패 幸運 행운 責任 책임 状況 상황 性格 성격 以上 이상 以下 이하 相談 상담 報告 보고 経験 경험 連絡 연락 規則 규칙 募集 모집 改善 개선 参加 참가 全然 전혀 進歩 진보 影響 영향 協力 협력 説明 설명 予想 예상 再生 재생 選択 선택 表現 표현 機会 기회 条件 조건 課題 과제 感覚 감각 教育 교육 制度 제도 印象 인상 環境 환경 方法 방법 可能 가능 不安 불안 注意 주의 安心 안심 到着 도착 存在 존재 例外 예외 調査 조사 効果 효과 進学 진학 事実 사실 配達 배달 会議 회의 法律 법률 機能 기능 観光 관광 提供 제공 発表 발표 通勤 통근 宿泊 숙박 賛成 찬성 反対 반대 発見 발견 案内 안내 資料 자료 商業 상업 都合 형편 内容 내용 場合 경우 計画 계획 販売 판매 消費 소비 証明 증명 温度 온도 冷房 냉방 深刻 심각 読書 독서 提案 제안 表情 표정 保証 보증 選挙 선거 取引 거래 進行 진행 観察 관찰 演奏 연주 能力 능력 成績 성적 展開 전개 支配 지배 成長 성장 供給 공급 反応 반응 状態 상태 物価 물가 支出 지출 景気 경기 進路 진로 詳細 상세 領収書 영수증 確率 확률 技術 기술 利益 이익 印刷 인쇄 申請 신청 応用 응용 信号 신호 特色 특색 構造 구조 面接 면접 選択肢 선택지 達成 달성 作業 작업 用事 용무 求人 구인 競争 경쟁 期限 기한 報酬 보수 公共 공공 素材 소재 感想 감상 創造 창조 進展 진전 効率 효율 製品 제품 要素 요소 計算 계산 体験 체험 組織 조직 構成 구성 基本 기본 発展 발전 結論 결론 試合 시합 価値 가치 解決 해결 課程 과정 職業 직업 設計 설계 意識 의식 予測 예측 調整 조정 変更 변경 範囲 범위 収入 수입 設備 설비 到達 도달 予算 예산 権利 권리 配分 배분 平均 평균 取材 취재 展示 전시 想像 상상 証拠 증거 編集 편집 審査 심사 議論 의논 改革 개혁 機関 기관 目標 목표 応援 응원 会社 회사 大企業 대기업 動く 움직이다 変える 바꾸다 行く 가다 来る 오다 見る 보다 食べる 먹다 飲む 마시다 聞く 듣다,묻다 書く 쓰다 読む 읽다 作る 만들다 思う 생각하다 使う 사용하다 歩く 걷다 泳ぐ 수영하다 寝る 자다 起きる 일어나다 立つ 서다 座る 앉다 笑う 웃다 泣く 울다 売る 팔다 買う 사다 送る 보내다 歌う 노래하다 描く 그리다 掛ける 걸다 受ける 받다 渡す 건네다 質問する 질문하다 会う 만나다 待つ 기다리다 始める 시작하다 終わる 끝나다 続ける 계속하다 止まる 멈추다 戻る 돌아가다 進む 나아가다 帰る 돌아가다 触る 만지다 選ぶ 고르다 決める 결정하다 消す 끄다 開ける 열다 閉める 닫다 教える 가르치다 習う 배우다 信じる 믿다 思い出す 기억하다 忘れる 잊다 助ける 돕다 借りる 빌리다 返す 반납하다 始まる 시작되다 働く 일하다 遊ぶ 놀다 飛ぶ 날다 着る 입다 脱ぐ 벗다 考える 생각하다 入る 들어가다 出る 나가다 見つける 찾다 探す 찾다 育てる 기르다 頼む 부탁하다 寝かせる 재우다 支える 지탱하다 試す 시험하다 投げる 던지다 引く 당기다 押す 밀다 叫ぶ 소리지르다 知る 알다 切る 자르다 増える 늘다 減る 줄다 動かす 움직이다 見せる 보여주다 守る 지키다 許す 허락하다 与える 주다 捨てる 버리다 預ける 맡기다 怒る 화내다 喜ぶ 기뻐하다 驚く 놀라다 決まる 결정되다 記憶する 기억하다 運転する 운전하다 準備する 준비하다 呼ぶ 부르다 踊る 춤추다 叱る 꾸짖다 思い付く 생각해내다 無くす 잃어버리다 届く 도착하다,닿다 求める 요구하다 急ぐ 서두르다 減らす 줄이다 誘う 초대하다,권하다 驚かす 놀라게하다 解く 풀다 調べる 조사하다 描く 그리다 頼る 의지하다 許可する 허가하다 検索する 검색하다 直す 고치다 笑わせる 웃게하다 企てる 계획하다 向かう 향하다 争う 다투다,경쟁하다 頑張る 열심히하다 失う 잃다 増やす 늘리다 運ぶ 나르다 含む 포함하다 渡る 건너다 壊す 부수다 育つ 자라다 飾る 장식하다 打つ 치다 加える 더하다 引く 당기다,끌다 触る 만지다,닿다 勝つ 이기다 失う 잃다 立てる 세우다 交わす 교환하다 求める 요구하다 伸ばす 늘리다 通う 왕래하다 飛ばす 날리다 出発する 출발하다 話す 말하다 休む 쉬다 進む 나아가다 探す 찾다 翻訳する 번역하다 決める 결정하다 渡す 건네다 書く 쓰다 決まる 결정되다 学ぶ 배우다 生きる 살다 消える 없어지다 見つける 발견하다 続ける 계속하다 変わる 바뀌다`
.trim();

  // `word-input`에 일본어 단어들을 삽입
  document.getElementById('word-input').value = japaneseWords;
}
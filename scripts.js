document.getElementById('start-btn').addEventListener('click', startQuiz);
document.getElementById('japanese-words-btn').addEventListener('click', loadJapaneseWords);

let words = [];
let correctCount = 0;
let questionIndex = 0;

async function startQuiz() {
  const input = document.getElementById('word-input').value.trim();
  if (!input) return alert('단어와 뜻을 입력하세요.');

  // 입력 문자열을 줄바꿈 단위 또는 공백 단위로 나누기
  let lines = input.includes('\n') 
    ? input.split('\n').map(line => line.trim()) // 줄바꿈 기준으로 처리
    : input.split(/\s+/); // 공백 기준으로 처리

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
  questionIndex = 0;

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
      // 중복된 단어의 뜻을 추가
      const existingMeaning = wordMap.get(trimmedWord);
      wordMap.set(trimmedWord, `${existingMeaning}, ${trimmedMeaning}`);
    }
  });

  return Array.from(wordMap.entries()).map(([word, meaning]) => ({ word, meaning }));
}

function updateStats() {
  document.getElementById('correct-count').innerText = correctCount;
  document.getElementById('total-count').innerText = words.length;
  document.getElementById('progress').style.width = `${(correctCount / words.length) * 100}%`;
}

async function loadNextQuestion() {
  if (questionIndex >= words.length) {
    alert(`정답률 : ${(correctCount / words.length * 100).toFixed(1)}%`);
    resetQuiz();
    return;
  }

  const currentQuestion = words[questionIndex];
  const mode = Math.random() > 0.5 ? 'hide-word' : 'hide-meaning';
  const question = mode === 'hide-word' ? currentQuestion.meaning : currentQuestion.word;
  const correctAnswer = mode === 'hide-word' ? currentQuestion.word : currentQuestion.meaning;

  const choices = generateChoices(correctAnswer, mode);
  renderQuestion(question, choices, correctAnswer);

  questionIndex++;
}

function generateChoices(correctAnswer, mode) {
  const choicesCount = parseInt(document.getElementById('choices-count').value, 10);

  if (words.length < choicesCount) {
    alert(`단어 수가 선택지 수(${choicesCount})보다 적습니다. 단어를 더 입력하세요.`);
    resetQuiz();
    return [];
  }

  const choices = new Set([correctAnswer]);

  while (choices.size < choicesCount) {
    const randomItem = words[Math.floor(Math.random() * words.length)];
    const choice = mode === 'hide-word' ? randomItem.word : randomItem.meaning;
    choices.add(choice);
  }

  return shuffleArray([...choices]);
}

function renderQuestion(question, choices, correctAnswer) {
  document.getElementById('question').innerText = question;

  const choicesContainer = document.getElementById('choices');
  const fragment = document.createDocumentFragment();  // DOM 조작 최적화

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
`気分 기분 安全 안전 期待 기대 笑顔 웃는얼굴 家族 가족 感謝 감사 危険 위험 意見 의견 友達 친구 旅行 여행 習慣 습관 自然 자연 必要 필요 約束 약속 準備 준비 健康 건강 目的 목적 結果 결과 会話 회화 卒業 졸업 宿題 숙제 知識 지식 努力 노력 運転 운전 準備 준비 関係 관계 仕事 일 文化 문화 確認 확인 重要 중요 生活 생활 社会 사회 予定 예정 感動 감동 景色 경치 経済 경제 夢中 열중 失敗 실패 幸運 행운 責任 책임 状況 상황 性格 성격 以上 이상 以下 이하 相談 상담 報告 보고 結果 결과 経験 경험 連絡 연락 規則 규칙 募集 모집 改善 개선 成功 성공 参加 참가 全然 전혀 進歩 진보 影響 영향 責任 책임 協力 협력 説明 설명 準備 준비 予想 예상 再生 재생 選択 선택 表現 표현 機会 기회 自然 자연 条件 조건 課題 과제 感覚 감각 教育 교육 制度 제도 目的 목적 印象 인상 環境 환경 方法 방법 必要 필요 可能 가능 不安 불안 重要 중요 注意 주의 安心 안심 到着 도착 存在 존재 経済 경제 例外 예외 調査 조사 効果 효과 感謝 감사 進学 진학 事実 사실 配達 배달 会議 회의 結果 결과 法律 법률 機能 기능 感動 감동 観光 관광 提供 제공 発表 발표 通勤 통근 宿泊 숙박 賛成 찬성 反対 반대 発見 발견 忘年会 망년회 案内 안내 資料 자료 商業 상업 都合 형편 内容 내용 場合 경우 計画 계획 販売 판매 消費 소비 証明 증명 温度 온도 確認 확인 冷房 냉방 深刻 심각 状況 상황 説明 설명 読書 독서 存在 존재 改善 개선 提案 제안 表情 표정 保証 보증 選挙 선거 相談 상담 取引 거래 進行 진행 観察 관찰 演奏 연주 能力 능력 責任 책임 成績 성적 展開 전개 支配 지배 成長 성장 供給 공급 反応 반응 状態 상태 物価 물가 支出 지출 景気 경기 進路 진로 詳細 상세 領収書 영수증 確率 확률 技術 기술 利益 이익 印刷 인쇄 申請 신청 応用 응용 信号 신호 特色 특색 構造 구조 責任 책임 面接 면접 選択肢 선택지 達成 달성 作業 작업 用事 용무 求人 구인 競争 경쟁 期限 기한 協力 협력 報酬 보수 公共 공공 制度 제도 素材 소재 感想 감상 創造 창조 進展 진전 効率 효율 製品 제품 要素 요소 計算 계산 体験 체험 組織 조직 構成 구성 基本 기본 準備 준비 発展 발전 結論 결론 期待 기대 印象 인상 試合 시합 知識 지식 能力 능력 価値 가치 解決 해결 課程 과정 職業 직업 設計 설계 意識 의식 予測 예측 調整 조정 変更 변경 範囲 범위 収入 수입 改善 개선 設備 설비 到達 도달 予算 예산 詳細 상세 権利 권리 配分 배분 平均 평균 取材 취재 展示 전시 想像 상상 証拠 증거 編集 편집 審査 심사 議論 의논 改革 개혁 資料 자료 機関 기관 目標 목표 感覚 감각 応援 응원 会社 회사 大企業 대기업 動く 움직이다 変える 바꾸다 行く 가다 来る 오다 見る 보다 食べる 먹다 飲む 마시다 聞く 듣다 話す 말하다 書く 쓰다 読む 읽다 作る 만들다 思う 생각하다 使う 사용하다 歩く 걷다 泳ぐ 수영하다 寝る 자다 起きる 일어나다 立つ 서다 座る 앉다 笑う 웃다 泣く 울다 売る 팔다 買う 사다 送る 보내다 歌う 노래하다 描く 그리다 掛ける 걸다 受ける 받다 渡す 건네다 説明する 설명하다 質問する 질문하다 会う 만나다 待つ 기다리다 始める 시작하다 終わる 끝나다 続ける 계속하다 止まる 멈추다 戻る 돌아가다 進む 나아가다 帰る 돌아가다 触る 만지다 選ぶ 고르다 決める 결정하다 消す 끄다, 지우다 開ける 열다 閉める 닫다 教える 가르치다 習う 배우다 信じる 믿다 思い出す 기억하다 忘れる 잊다 助ける 돕다 借りる 빌리다 返す 반납하다 始まる 시작되다 終わる 끝나다 働く 일하다 遊ぶ 놀다 歩く 걷다 飛ぶ 날다 笑う 웃다 泣く 울다 眠る 자다 起きる 일어나다 食べる 먹다 飲む 마시다 着る 입다 脱ぐ 벗다 寝る 자다 遊ぶ 놀다 考える 생각하다 買う 사다 売る 팔다 読む 읽다 書く 쓰다 待つ 기다리다 入る 들어가다 出る 나가다 立つ 서다 座る 앉다 笑う 웃다 泣く 울다 会う 만나다 見つける 찾다 探す 찾다 選ぶ 고르다 決める 결정하다 聞く 묻다 育てる 기르다 頼む 부탁하다 決める 결정하다 寝かせる 재우다 支える 지탱하다 試す 시험하다 投げる 던지다 引く 당기다 押す 밀다 探す 찾다 歩く 걷다 叫ぶ 소리 지르다 知る 알다 教える 가르치다 切る 자르다 買う 사다 売る 팔다 増える 늘다 減る 줄다 動かす 움직이다 見せる 보여주다 守る 지키다 許す 허락하다 返す 돌려주다 与える 주다 選ぶ 고르다 捨てる 버리다 預ける 맡기다 怒る 화내다 喜ぶ 기뻐하다 驚く 놀라다 決まる 결정되다 記憶する 기억하다 帰る 돌아가다 変わる 변하다 準備する 준비하다 呼ぶ 부르다 踊る 춤추다 叱る 꾸짖다 思い付く 생각해내다 無くす 잃어버리다 見つける 찾다 作る 만들다 開く 열다 閉じる 닫다 運転する 운전하다`
.trim();

  // `word-input`에 일본어 단어들을 삽입
  document.getElementById('word-input').value = japaneseWords;
}
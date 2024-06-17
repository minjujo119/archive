// 'use strict';

// variable
const $header = document.querySelector('.header'),
  $main = document.querySelector('.main'),
  $cellList = document.querySelector('.cell-list'),
  $cellItems = $cellList.childNodes,
  $levelList = document.querySelector('.level-list'),
  $levelItems = document.querySelectorAll('.level-item'),
  $footer = document.querySelector('.footer'),
  $dimmedFail = document.querySelector('.dimmed.failed'),
  $dimmedClear = document.querySelector('.dimmed.clear'),

  $timer = document.querySelector('.screen.timer'),
  $btnReset = document.querySelector('.btn-reset'),
  statusFlag = 'status-flag',
  statusBomb = 'status-bomb',
  status0 = 'status-0',
  status1 = 'status-1',
  status2 = 'status-2',
  status3 = 'status-3',
  status4 = 'status-4',
  cellSize = 40;

let currentLevel = 1;

// 레벨에 따라 DOM에 셀 그리기
const createCell = (cellNumber) => {

  // 셀 개수에 따라 main의 너비값 설정
  $main.style.width = Math.sqrt(cellNumber) * cellSize + 'px';

  for (let i = 0; i < cellNumber; i++) {
    const cellItem = document.createElement('input');
    cellItem.type = 'checkbox';
    cellItem.className = 'cell-item';
    $cellList.appendChild(cellItem);
  }
}


// 랜덤 숫자 뽑기 (비복원추출 재귀함수)
const extractRandomNum = (cellNumber, bombNumber, array) => {

  if (!array) { var array = []; }

  let n = Math.floor(Math.random() * cellNumber) + 1;

  if (array.length < bombNumber && array.indexOf(n) < 0) {
    array.push(n);
    return extractRandomNum(cellNumber, bombNumber, array);
  }
  else if (array.length < bombNumber && array.indexOf(n) >= 0) {
    return extractRandomNum(cellNumber, bombNumber, array);
  }
  else {
    return array;
  }
};

// 뽑은 랜덤 숫자에 해당하는 칸에 지뢰 배치
const arrangeBomb = (randomNumArray) => {

  $cellItems.forEach((cellItem, cellIndex) => {

    if (randomNumArray.indexOf(cellIndex) != -1) {
      cellItem.classList.add(statusBomb);
    }

  })

};

// 힌트 숫자 배치
const arrangeHint = () => {

  $cellItems.forEach(cellItem => {

    let guideNum = 0;

    // 가운데 셀의 좌표 구하기
    const centerX = cellItem.getBoundingClientRect().left + cellSize / 2;
    const centerY = cellItem.getBoundingClientRect().top + cellSize / 2;

    // 가운데 셀 주위의 요소들 좌표로 선택
    const arroundCells = [
      document.elementFromPoint(centerX - cellSize, centerY - cellSize),
      document.elementFromPoint(centerX, centerY - cellSize),
      document.elementFromPoint(centerX + cellSize, centerY - cellSize),
      document.elementFromPoint(centerX - cellSize, centerY),
      document.elementFromPoint(centerX + cellSize, centerY),
      document.elementFromPoint(centerX - cellSize, centerY + cellSize),
      document.elementFromPoint(centerX, centerY + cellSize),
      document.elementFromPoint(centerX + cellSize, centerY + cellSize),
    ];

    // 가운데 셀 주위에 지뢰 몇 개인지 감지
    arroundCells.forEach(cell => {

      if (cell !== $main && cell.classList.contains(statusBomb)) {
        guideNum += 1;
      };

    });

    // 셀에 힌트 숫자 쓰기
    if (guideNum === 0 && !cellItem.classList.contains(statusBomb)) {
      cellItem.classList.add(status0);
      return;

    } else if (cellItem.classList.contains(statusBomb)) {
      return;

    } else {
      $(cellItem).addClass(`status-${guideNum}`);
    }
  });
};

// 빈 셀 주변 셀들 자동 클릭
const cellAutoClick = (cellItem) => {

  // 가운데 셀의 좌표 구하기
  const centerX = cellItem.getBoundingClientRect().left + cellSize / 2;
  const centerY = cellItem.getBoundingClientRect().top + cellSize / 2;

  // 가운데 셀 주위의 요소들 좌표로 선택
  const arroundCells = [
    document.elementFromPoint(centerX - cellSize, centerY - cellSize),
    document.elementFromPoint(centerX, centerY - cellSize),
    document.elementFromPoint(centerX + cellSize, centerY - cellSize),
    document.elementFromPoint(centerX - cellSize, centerY),
    document.elementFromPoint(centerX + cellSize, centerY),
    document.elementFromPoint(centerX - cellSize, centerY + cellSize),
    document.elementFromPoint(centerX, centerY + cellSize),
    document.elementFromPoint(centerX + cellSize, centerY + cellSize),
  ];

  // 주변 셀 클릭 처리
  arroundCells.forEach(cell => {
    if (cell !== $main) {
      cell.checked = true;
      cell.disabled = true;
    };
  });
};

// 지뢰 클릭 시 게임오버
const gameOver = () => {

  $dimmedFail.style.display = 'flex';
  $($timer).stopwatch().stopwatch('stop');
  $cellItems.forEach(cellItem => {
    cellItem.classList.remove(statusFlag);
    cellItem.checked = true;
  });

};

// 지뢰 제외한 모든 셀 클릭 시 게임 클리어
const gameClear = () => {

  $dimmedClear.style.display = 'flex';
  $($timer).stopwatch().stopwatch('stop');
}

// 실행문
const init = (cellNumber, bombNumber) => {
  $levelList.style.display = 'none';
  createCell(cellNumber);
  let randomNumArray = extractRandomNum(cellNumber, bombNumber, undefined); // 배치할 지뢰 개수 파라미터로 전달
  arrangeBomb(randomNumArray);
  arrangeHint();
  $($timer).stopwatch().stopwatch('start');
};


// 리셋 버튼 클릭 시 초기화면으로 돌아가기
$btnReset.addEventListener('click', () => {

  $dimmed.style.display = 'none';
  $main.style.width = 260 + 'px';
  $levelList.style.display = 'block';

  $cellList.replaceChildren(); // 모든 셀 삭제하기
  $($timer).stopwatch().stopwatch('reset');
  $($timer).stopwatch().stopwatch('stop');

});


// 레벨을 선택하면 게임 시작
$levelList.addEventListener('click', (e) => {

  const levelItem = e.target;
  const levelID = levelItem.getAttribute('id');

  if (levelID == 'level1') { init(81, 10); }
  else if (levelID == 'level2') { init(144, 20); }
  else if (levelID == 'level3') { init(256, 40); }
});

// 마우스 왼클릭 이벤트
$cellList.addEventListener('click', (e) => {

  console.log(currentLevel)

  const cellItem = e.target;
  const cellList = e.currentTarget;
  const cellItemArray = cellList.childNodes;
  let successCount = 0;
  let bombCount = 0;

  // 기본적인 셀 클릭 동작
  if (!cellItem.classList.contains(statusFlag)) {
    cellItem.checked = true;
    cellItem.disabled = true;
  }

  // 지뢰 클릭 시
  if (cellItem.classList.contains(statusBomb)) {
    setTimeout(() => { gameOver(); }, 100);
  }
  // 빈 셀 클릭 시
  if (cellItem.classList.contains(status0)) {
    cellAutoClick(cellItem);
  }

  // 지뢰를 제외한 모든 셀을 클릭했는지 카운트
  cellItemArray.forEach(item => {
    if (item.classList.contains(statusBomb)) bombCount += 1;
    if (item.checked) successCount += 1;
  });

  // 지뢰 제외 모든 셀 클릭 시 게임 클리어!
  if (successCount == cellItemArray.length - bombCount) {
    setTimeout(() => { gameClear(); }, 100);
  };

});

// 마우스 우클릭 이벤트
$cellList.addEventListener('contextmenu', (e) => {

  const cellItem = e.target;

  e.preventDefault();

  const isFlagged = cellItem.classList.contains(statusFlag);

  if (!isFlagged && !cellItem.checked) {
    cellItem.classList.add(statusFlag);
    cellItem.disabled = true;

  } else {
    cellItem.classList.remove(statusFlag);
    cellItem.disabled = false;
  };

});
const headerHeight = $('.header').height();

// 스크롤 인터랙션
$(window).on("scroll", function () {
  let scrollTop = $('html,body').scrollTop();
  const shopLNB = $('.content_sub .lnb');
  const btnTop = $('.btn_top');

  // 아래로 스크롤 시 포커상점 LNB 고정
  if (scrollTop >= headerHeight) {
    shopLNB.addClass('is_fixed');
  } else {
    shopLNB.removeClass('is_fixed');
  };

  // 최상단으로 스크롤 시 TOP버튼 사라지고, 아래로 스크롤 시 나타남
  if (scrollTop <= 1) {
    btnTop.hide();
  } else {
    btnTop.show();
  }
});

// GNB(전체메뉴) 열기
const gnbShow = () => {
  $('body').addClass('scroll_lock');
  $('.dimmed').show();
  $('.gnb').show();
  $('.gnb').addClass('is_show');
}
// GNB(전체메뉴) 닫기
const gnbHide = () => {
  $('body').removeClass('scroll_lock');
  $('.dimmed').hide();
  $('.gnb').removeClass('is_show');
}

// GNB 메뉴열기/닫기 버튼 클릭 시
$('.btn_gnb').on("click", function () {
  const isGnbShow = $('.gnb').hasClass('is_show');
  isGnbShow ? gnbHide() : gnbShow();
});

// 딤드 클릭 시 GNB 닫힘
$('.dimmed').on("click", gnbHide)

// 체크박스 전체 선택 클릭 시
$('#check_all_product').on("click", function () {

  if ($(this).prop('checked')) {
    $('[name="product"]').prop('checked', true);
  } else {
    $('[name="product"]').prop('checked', false);
  }
});

// 내가 자주 구매한 상품 모두 보기 / 접기
$('.section_frequency .btn_fold').on("click", function () {

  const productLst = $('.section_frequency .product_lst')
  const btnFold = $('.section_frequency .btn_fold');
  const isLstFold = productLst.hasClass('is_fold');

  if (isLstFold) {
    productLst.removeClass('is_fold');
    btnFold.hide();
    btnFold.eq(1).css({ 'display': 'flex' });
  } else {
    productLst.addClass('is_fold');
    btnFold.hide();
    btnFold.eq(0).css({ 'display': 'flex' });
  }
})

// 머니 계산기 펼치기/접기
$('.calculator_btn').on("click", function () {
  $(this).parent().toggleClass('is_fold');
  $('.calculator_btn').toggle();
})

// 상점 가이드 펼치기/접기
$('.btn_guide').on("click", function () {
  $(this).parent().toggleClass('is_fold')
})

// footer 정보 토글
$('.company_info_btn').on("click", function () {
  $(this).toggleClass('is_active');
});

// layer 닫기 버튼 클릭 시 팝업 닫기
$('.layer_wrap .btn_close').on("click", function () {
  $(this).parents('.layer_wrap').hide();
  $('body').removeClass('scroll_lock');
});

// fixed 헤더 높이만큼 더 내려가게 스크롤 높이 조정
const gotoSectionTitle = (id) => {
  setTimeout(function () {
    const $target = $(id);
    const scrollOffset = 110;
    const targetOffset = $target.offset().top
    const y = targetOffset - scrollOffset;
    if ($target.length) window.scrollTo(0, y);
  }, 0)
};

// 북마크 항목 클릭 시 
$('.bookmark_itm').on("click", function () {
  gotoSectionTitle($(this).attr('href'));
  $('.bookmark_itm').removeClass('is_selected');
  $(this).addClass('is_selected');
});

// 목차 항목 클릭 시
$('.index_itm').on("click", function () {
  gotoSectionTitle($(this).attr('href'));
});

// 로그인 되어있을 때만 바텀시트 상승/하강
const bottom = document.querySelector('.bottom_sheet');
const bottomMemberArea = document.querySelectorAll('.bottom_sheet .member_data_area')[1];

let startTime;
let endTime;
let yStart;
let yDelta;
let bottomTouched = false;

bottom.addEventListener('touchstart', (e) => {
  let isLogedin = bottomMemberArea.style.display === 'block';
  if (isLogedin) {
		bottomTouched = true;
		startTime = Date.now();
		yStart = e.touches[0].clientY;
    scrollLock.disablePageScroll();
	} else {
		bottomTouched = false;
	}
})

bottom.addEventListener('click', (e) => {
	bottomTouched = false;
})

document.documentElement.addEventListener('touchend',(e) => {	
	if (bottomTouched === true) {
		endTime = Date.now();
		yDelta = e.changedTouches[0].clientY - yStart;
		touchTime = endTime - startTime;
		
		if (touchTime < 2000 && yDelta > 0) {
			bottom.parentElement.classList.remove('is_up');
		} else if (touchTime < 2000 && yDelta < 0) {
			bottom.parentElement.classList.add('is_up');
		}
    scrollLock.enablePageScroll();
	}
  bottomTouched = false;
});
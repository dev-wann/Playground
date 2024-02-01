let timeoutID: number;

export function organizeFolder() {
  const folder = document.getElementById('folder');
  if (!folder) return;
  const pageNum = folder.children.length;

  for (let i = 0; i < pageNum; i += 1) {
    let page = folder.children.item(i) as HTMLElement;
    page.style.zIndex = `${pageNum - i}`;
    page.style.left = `${(i * 20) / (pageNum - 1)}px`;
    page.style.bottom = `${(i * 20) / (pageNum - 1) + 40}px`;
    if (i !== 0 && i !== pageNum - 1) {
      // index 정렬
      let indexFace = page.children.item(0)?.children.item(0) as HTMLElement;
      let indexBack = page.children.item(1)?.children.item(0) as HTMLElement;
      let left = `calc(1vw + (100% - 2vw - var(--index-width)) * ${
        (i - 1) / (pageNum - 3)
      })`;
      if (indexFace && indexBack) {
        indexFace.style.left = left;
        indexBack.style.left = left;
      }
    }
  }
  adjustBrightness(0);
}

export function induceFlip(page: number, flipped?: boolean) {
  if (page !== 0) return;
  const coverFace = document.getElementById('folder')?.firstChild
    ?.firstChild as HTMLElement;
  const coverBack = document.getElementById('folder')?.firstChild
    ?.lastChild as HTMLElement;
  if (!coverFace || !coverBack) return;
  coverFace.style.transform = flipped ? 'rotateX(0deg)' : 'rotateX(-15deg)';
  coverBack.style.transform = flipped ? 'rotateX(0deg)' : 'rotateX(-15deg)';
  timeoutID = window.setTimeout(() => {
    if (!flipped) induceFlip(page, true);
  }, 500);
}

export function flipBack(page: number) {
  clearTimeout(timeoutID);
  const folder = document.getElementById('folder');
  if (!folder) return false;
  const pageNum = folder.children.length;
  if (page >= pageNum - 1) return false;

  let curPage = folder.children.item(page) as HTMLElement;
  if (!curPage) return false;

  for (let i = 0; i < curPage.children.length; i += 1) {
    let child = curPage.children.item(i) as HTMLElement;
    child.style.transform = 'rotateX(-100deg)';
  }
  curPage.style.zIndex = `${page + pageNum}`;

  // flipForward 시 backface 순서 역전되는 현상 방지
  window.setTimeout(() => {
    curPage.style.zIndex = `${page - pageNum}`;
  }, 500);

  adjustBrightness(page + 1);

  return true;
}

export function flipForward(page: number) {
  if (page <= 0) return false;
  const folder = document.getElementById('folder');
  if (!folder) return false;

  let curPage = folder.children.item(page - 1) as HTMLElement;
  if (!curPage) return;

  for (let i = 0; i < curPage.children.length; i += 1) {
    let child = curPage.children.item(i) as HTMLElement;
    child.style.transform = 'rotateX(0)';
  }
  curPage.style.zIndex = `${folder.children.length - page + 1}`;

  adjustBrightness(page - 1);

  return true;
}

export function initFlip() {
  const folder = document.getElementById('folder');
  if (!folder) return false;

  let time = 0;
  for (let i = folder.children.length - 1; i >= 0; i -= 1) {
    setTimeout(() => {
      flipForward(i);
    }, time);
    time += 100;
  }
  adjustBrightness(0);
}

function adjustBrightness(start: number) {
  const folder = document.getElementById('folder');
  if (!folder) return;
  const pageNum = folder.children.length;

  let page;
  // pages flipped
  for (let i = 0; i < start; i += 1) {
    page = folder.children.item(i) as HTMLElement;
    page.style.filter = `brightness(${
      80 - (40 / (pageNum - 1)) * (start - i)
    }%)`;
  }
  // pages not flipped
  for (let i = start; i < pageNum; i += 1) {
    page = folder.children.item(i) as HTMLElement;
    page.style.filter = `brightness(${
      100 - (40 / (pageNum - 1)) * (i - start)
    }%)`;
  }
}

export function isLastPage(page: number) {
  const folder = document.getElementById('folder');
  return folder?.children.length === page + 1;
}

const drawWordList = (ctx, list, x, y) => {
  ctx.font = '16px VCR OSD Mono';
  const wordString = list.reverse().join(' ');
  ctx.fillText(wordString, x, y);
};

const drawWordListInIcons = (ctx, list, x, y, icon) => {
  ctx.font = '16px VCR OSD Mono';
  const wordString = list.reverse().join(' ');
  ctx.putImageData(icon, x, y);
  ctx.fillText(wordString, x, y);
};



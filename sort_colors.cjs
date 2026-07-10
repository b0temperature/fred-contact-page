const fs = require('fs');

const HARDWARE_COLORS = [
  { "name": "深蓝 Deep Blue", "hex": "#32374A" },
  { "name": "宇宙橙 Cosmic Orange", "hex": "#F77E2D" },
  { "name": "银色 Silver", "hex": "#F5F5F5" },
  { "name": "天蓝 Sky Blue", "hex": "#F0F9FF" },
  { "name": "浅金 Light Gold", "hex": "#FFFCF5" },
  { "name": "深空黑 Space Black", "hex": "#000000" },
  { "name": "云白 Cloud White", "hex": "#FCFCFC" },
  { "name": "薰衣草紫 Lavender", "hex": "#DFCEEA" },
  { "name": "雾蓝 Mist Blue", "hex": "#96AED1" },
  { "name": "鼠尾草绿 Sage", "hex": "#A9B689" },
  { "name": "黑色 Black", "hex": "#353839" },
  { "name": "柔粉 Soft Pink", "hex": "#FCE7E6" },
  { "name": "黑色 Black (16e)", "hex": "#3C4042" },
  { "name": "白色 White", "hex": "#FAFAFA" },
  { "name": "原色钛 Natural Titanium", "hex": "#C2BCB2" },
  { "name": "沙漠钛 Desert Titanium", "hex": "#BFA48F" },
  { "name": "黑钛 Black Titanium", "hex": "#3C3C3D" },
  { "name": "白钛 White Titanium", "hex": "#F2F1ED" },
  { "name": "粉色 Pink", "hex": "#F2ADDA" },
  { "name": "群青 Ultramarine", "hex": "#9AADF6" },
  { "name": "青色 Teal", "hex": "#B0D4D2" },
  { "name": "蓝钛 Blue Titanium", "hex": "#2F4452" },
  { "name": "原色钛 Natural Titanium (15)", "hex": "#837F7D" },
  { "name": "黑钛 Black Titanium (15)", "hex": "#1B1B1B" },
  { "name": "白钛 White Titanium (15)", "hex": "#DDDDDD" },
  { "name": "粉 Pink", "hex": "#E3C8CA" },
  { "name": "蓝 Blue", "hex": "#CED5D9" },
  { "name": "绿 Green", "hex": "#CAD4C5" },
  { "name": "黄 Yellow", "hex": "#E5E0C1" },
  { "name": "黑 Black", "hex": "#35393B" },
  { "name": "暗紫 Deep Purple", "hex": "#594F63" },
  { "name": "深空黑 Space Black (14)", "hex": "#403E3D" },
  { "name": "银 Silver", "hex": "#F0F2F2" },
  { "name": "金 Gold", "hex": "#F4E8CE" },
  { "name": "紫 Purple", "hex": "#E6DDEB" },
  { "name": "蓝 Blue (14)", "hex": "#A0B4C7" },
  { "name": "黄 Yellow (14)", "hex": "#F9E479" },
  { "name": "午夜色 Midnight", "hex": "#222930" },
  { "name": "星光色 Starlight", "hex": "#FAF6F2" },
  { "name": "红 (PRODUCT)RED", "hex": "#FC0324" },
  { "name": "午夜", "hex": "#232A31" },
  { "name": "红", "hex": "#BF0013" },
  { "name": "远峰蓝 Sierra Blue", "hex": "#A7C1D9" },
  { "name": "苍岭绿 Alpine Green", "hex": "#576856" },
  { "name": "石墨 Graphite", "hex": "#54524F" },
  { "name": "银", "hex": "#F1F2ED" },
  { "name": "金", "hex": "#FAE7CF" },
  { "name": "蓝 Blue (13)", "hex": "#276787" },
  { "name": "绿 Green (13)", "hex": "#394C38" },
  { "name": "粉 Pink (13)", "hex": "#FADDD7" },
  { "name": "海蓝 Pacific Blue", "hex": "#2D4E5C" },
  { "name": "石墨", "hex": "#52514D" },
  { "name": "银 (12)", "hex": "#E3E4DF" },
  { "name": "金 (12)", "hex": "#FCEBD3" },
  { "name": "紫 Purple (12)", "hex": "#B7AFE6" },
  { "name": "蓝 Blue (12)", "hex": "#023B63" },
  { "name": "绿 Green (12)", "hex": "#D8EFD5" },
  { "name": "黑", "hex": "#25212B" },
  { "name": "白", "hex": "#F6F2EF" },
  { "name": "红 (12)", "hex": "#D82E2E" },
  { "name": "黑 (SE2)", "hex": "#262529" },
  { "name": "白 (SE2)", "hex": "#F3F3F3" },
  { "name": "红 (SE2)", "hex": "#B41325" },
  { "name": "暗夜绿 Midnight Green", "hex": "#4E5851" },
  { "name": "深空灰", "hex": "#535150" },
  { "name": "银 (11)", "hex": "#EBEBE3" },
  { "name": "金 (11)", "hex": "#FAD7BD" },
  { "name": "紫 Purple (11)", "hex": "#D1CDDA" },
  { "name": "绿 Green (11)", "hex": "#AEE1CD" },
  { "name": "黄 Yellow (11)", "hex": "#FFE681" },
  { "name": "黑 (11)", "hex": "#1F2020" },
  { "name": "白 (11)", "hex": "#F9F6EF" },
  { "name": "红 (11)", "hex": "#BA0C2E" },
  { "name": "蓝 Blue (XR)", "hex": "#48AEE6" },
  { "name": "黄 Yellow (XR)", "hex": "#F9D045" },
  { "name": "珊瑚 Coral", "hex": "#FF6E5A" },
  { "name": "黑 (XR)", "hex": "#2E3034" },
  { "name": "银 (X)", "hex": "#E4E4E2" },
  { "name": "金 (XS)", "hex": "#FADCC2" },
  { "name": "深空灰 (X)", "hex": "#272729" },
  { "name": "银 (8)", "hex": "#E2E3E4" },
  { "name": "金 (8)", "hex": "#F7E8DD" },
  { "name": "红 (8)", "hex": "#960111" },
  { "name": "天蓝 Sky Blue (Air)", "hex": "#C9DCE8" },
  { "name": "银色 Silver (Air)", "hex": "#E3E4E5" },
  { "name": "星光色 Starlight (Air)", "hex": "#F0E4D3" },
  { "name": "午夜色 Midnight (Air)", "hex": "#2E3642" },
  { "name": "深空黑 Space Black (Mac)", "hex": "#2E2C2E" },
  { "name": "蓝 Blue (iMac)", "hex": "#4A6E9C" },
  { "name": "紫 Purple (iMac)", "hex": "#7A6FA8" },
  { "name": "粉 Pink (iMac)", "hex": "#E58EA0" },
  { "name": "橙 Orange", "hex": "#F0A04B" },
  { "name": "黄 Yellow (iMac)", "hex": "#F2CE4B" },
  { "name": "绿 Green (iMac)", "hex": "#5FA57D" },
  { "name": "曜石黑 Obsidian", "hex": "#2F3237" },
  { "name": "瓷白 Porcelain", "hex": "#EDE7DE" },
  { "name": "月光石 Moonstone", "hex": "#6A7583" },
  { "name": "玉绿 Jade", "hex": "#DCE5D9" },
  { "name": "靛蓝 Indigo", "hex": "#4E5FA8" },
  { "name": "霜白 Frost", "hex": "#D9E3EE" },
  { "name": "柠檬草 Lemongrass", "hex": "#DFE3B0" },
  { "name": "曜石黑 Obsidian (Pixel)", "hex": "#2E3133" },
  { "name": "瓷白 Porcelain (Pixel)", "hex": "#EDE6DB" },
  { "name": "榛木灰 Hazel", "hex": "#8E9A98" },
  { "name": "玫瑰石英 Rose Quartz", "hex": "#F0D7DB" },
  { "name": "冬青绿 Wintergreen", "hex": "#C3D1C4" },
  { "name": "芍药粉 Peony", "hex": "#F7C2D3" },
  { "name": "鸢尾紫 Iris", "hex": "#A9AFE0" },
  { "name": "亮铂金 Platinum", "hex": "#E4E5E3" },
  { "name": "典雅黑 Black", "hex": "#25262A" },
  { "name": "沙丘金 Dune", "hex": "#D9C3A5" },
  { "name": "宝石蓝 Sapphire", "hex": "#4A6B8F" },
  { "name": "翡翠绿 Jade (Surface)", "hex": "#9FB8A8" },
  { "name": "石墨灰 Graphite", "hex": "#4A4A4E" },
  { "name": "森林绿 Forest", "hex": "#5A6B58" }
];

function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

function rgbToHsl(r, g, b) {
  r /= 255, g /= 255, b /= 255;
  var max = Math.max(r, g, b), min = Math.min(r, g, b);
  var h, s, l = (max + min) / 2;
  if(max == min){
      h = s = 0; // achromatic
  }else{
      var d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch(max){
          case r: h = (g - b) / d + (g < b ? 6 : 0); break;
          case g: h = (b - r) / d + 2; break;
          case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
  }
  return [h, s, l];
}

const sorted = HARDWARE_COLORS.map(c => {
  const rgb = hexToRgb(c.hex);
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  return { ...c, h: hsl[0], s: hsl[1], l: hsl[2] };
}).sort((a, b) => {
  // Sort primarily by Hue, then Saturation, then Lightness
  if (Math.abs(a.h - b.h) > 0.05) {
      return a.h - b.h;
  }
  if (Math.abs(a.s - b.s) > 0.1) {
      return b.s - a.s;
  }
  return b.l - a.l;
});

// clean up added fields
const finalColors = sorted.map(c => ({name: c.name, hex: c.hex}));
console.log(JSON.stringify(finalColors, null, 2));

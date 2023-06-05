export function generateUuid() {
  let uuid = "";
  for (let i = 0; i < 32; i++) {
    uuid += Math.floor(Math.random() * 16).toString(16);
    if (i === 7 || i === 11 || i === 15 || i === 19) {
      uuid += "-";
    }
  }
  return uuid;
}

export async function saveImage(url: string, fileName: string) {
  const response = await fetch(url);
  const blob = await response.blob();

  // 创建一个隐藏的链接
  const link = document.createElement("a");
  link.style.display = "none";
  document.body.appendChild(link);

  // 使用 Blob URL 设置链接的 href 属性
  link.href = URL.createObjectURL(blob);
  link.download = fileName;

  // 模拟单击链接以保存文件
  link.click();

  // 清理链接和 Blob URL
  document.body.removeChild(link);
  URL.revokeObjectURL(link.href);
}

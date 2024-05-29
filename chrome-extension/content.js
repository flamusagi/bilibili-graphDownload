// 定义点击事件处理程序
function clickHandler(event) {
  footerElement=event.currentTarget.parentElement;
  console.log(footerElement);
  // 在点击事件处理程序中调用查找 dyn-id 的函数
  const dynIdValue = findDynIdFromButton(footerElement);
  console.log(dynIdValue);
  // 使用 dynIdValue 查找具有相应 dyn-id 属性值的元素
  const dynIdElement = document.querySelector(`div[dyn-id="${dynIdValue}"]`);
    console.log(dynIdElement);

  // 在当前dynId元素的范围内查找包含<div class="bili-album">的元素
  const biliAlbumElement = dynIdElement.querySelector('.bili-album');
  console.log(biliAlbumElement);
  if (biliAlbumElement) {
    // 在biliAlbumElement的范围内查找所有带有src属性的img标签
    const imgElements = biliAlbumElement.querySelectorAll('img[src]');

    const uniqueImgSrcArray = [];

    // 遍历每个带有src属性的<img>标签
    imgElements.forEach((img) => {
      const src = img.getAttribute('src');
      uniqueImgSrcArray.push(src);
    });

    console.log(uniqueImgSrcArray);

    // 遍历数组，替换末尾的字符串
    const modifiedImgSrcArray = uniqueImgSrcArray.map((src) => {
      // 使用字符串操作去掉@以后的内容
      const indexOfAt = src.indexOf('@');
      if (indexOfAt !== -1) {
        const newSrc = src.substring(0, indexOfAt);
        return newSrc;
      } else {
        return src; // 如果没有@，保持原始链接
      }
    });
    // 不重复的元素使用Set
    const uniqueImgSrcSet = new Set(modifiedImgSrcArray);
    console.log(uniqueImgSrcSet);
    //下载元素
    downloadImages(uniqueImgSrcSet);
  }
}

function getCurrentDateTime() {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
  const day = currentDate.getDate().toString().padStart(2, '0');
  const hours = currentDate.getHours().toString().padStart(2, '0');
  const minutes = currentDate.getMinutes().toString().padStart(2, '0');
  const seconds = currentDate.getSeconds().toString().padStart(2, '0');
  const formattedDateTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  return formattedDateTime;
}


function downloadImages(uniqueImgSrcSet) {
  // 创建一个下载链接元素
  const downloadLink = document.createElement('a');
  downloadLink.style.display = 'none';

  // 添加到文档中
  document.body.appendChild(downloadLink);

  // 遍历 uniqueImgSrcSet 中的每个图片URL
  uniqueImgSrcSet.forEach((src, index) => {
    if(src==""){
    return;}
    // 创建一个Blob URL
    fetch(`https:${src}`)
      .then(response => response.blob())
      .then(blob => {
        const url = URL.createObjectURL(blob);

        // 设置下载链接的href和download属性
        downloadLink.href = url;
        downloadLink.download = `${index}`; // 使用不同的文件名

        // 模拟点击下载链接
        downloadLink.click();

        // 释放Blob URL
        URL.revokeObjectURL(url);
      });
  });
}


function addCustomDownloadButton(footerElement) {
  const downloadButton = document.createElement('div');
  downloadButton.className = 'bili-dyn-item__action';

  const buttonDiv = document.createElement('div');
  buttonDiv.setAttribute('data-module', 'action');
  buttonDiv.setAttribute('data-type', 'download');
  buttonDiv.className = 'bili-dyn-action download';
  buttonDiv.innerText = '下载';
  downloadButton.addEventListener('click', clickHandler);
  //downloadButton.addEventListener('click', () => clickHandler(footerElement)); // 传递 footerElement

  downloadButton.appendChild(buttonDiv);
  footerElement.appendChild(downloadButton);
}

function findDynIdFromButton(footerElement) {
  // 找到相邻的上一个元素
  const bodyElement = footerElement.previousElementSibling;

  if (bodyElement) {
    // 遍历子元素
    const elements = bodyElement.querySelectorAll('*');

    for (const element of elements) {
      // 检查是否有 dyn-id 属性
      const dynId = element.getAttribute('dyn-id');
      if (dynId) {
      console.log('找到 dyn-id:', dynId);
        return dynId; // 找到后返回 dyn-id
      }
    }
  }

  // 如果未找到 dyn-id，则返回 null 或其他适当的值
  console.log('未找到 dyn-id:', null);
  return null;
}

let lastFooterCount = 0;

// 定义一个函数，用于检查是否有新内容加载并添加下载按钮
function checkForNewContent() {
  // 获取当前页面中包含 bili-dyn-item__footer 类名的元素数量
  const currentFooterCount = document.querySelectorAll('.bili-dyn-item__footer').length;

  // 检查是否有新的 footerElement 加载
  if (currentFooterCount > lastFooterCount) {
    // 获取新加载的 footerElements
    const newFooterElements = Array.from(document.querySelectorAll('.bili-dyn-item__footer')).slice(lastFooterCount);

    // 遍历新加载的 footerElements，并调用 addCustomDownloadButton 函数添加下载按钮
    newFooterElements.forEach((footerElement) => {
      addCustomDownloadButton(footerElement);
    });

    // 更新 lastFooterCount，以便下次检查时知道上次的数量
    lastFooterCount = currentFooterCount;
  }
}


if (window.location.href.includes("t.bilibili.com"))
{
// 初始页面加载时也执行一次检查
window.addEventListener('load', checkForNewContent);
// 添加滚动事件监听器，以便在滚动时调用检查函数
window.addEventListener('scroll', checkForNewContent);
}



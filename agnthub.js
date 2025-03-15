// https://quests.agnthub.ai/#/earn

// 选择所有未被禁用的按钮
const buttons = document.querySelectorAll('button:not([disabled])');

// 使用 XPath 查找特定的按钮，并将其存储在 excludedButton 变量中
const excludedButton = document.evaluate(
  '/html/body/div/div/div/div[2]/div/section/div[1]/div[3]/div/article/div[2]/div[2]/div[2]/button',
  document,
  null,
  XPathResult.FIRST_ORDERED_NODE_TYPE,
  null
).singleNodeValue;

// 定义一个函数，用于模拟点击按钮
const simulateButtonClick = (button) => {
  // 检查按钮是否存在且不是被排除的按钮
  if (button && button !== excludedButton) {
    // 创建一个新的鼠标点击事件
    const clickEvent = new MouseEvent('click', {
      view: window,   // 事件的视图
      bubbles: true,  // 事件是否冒泡
      cancelable: true // 事件是否可以被取消
    });
    // 触发按钮的点击事件
    button.dispatchEvent(clickEvent);
    console.log(`模拟点击按钮: ${button.textContent}`); // 输出模拟点击的按钮文本
  }
};

// 遍历所有按钮并调用 simulateButtonClick 函数
buttons.forEach(simulateButtonClick);

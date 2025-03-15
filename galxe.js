// https://app.galxe.com/quest/AGNTHub/GCwm1t1oYc

// 定义 XPath 获取元素函数
function getElementByXpath(path, context = document) {
  try {
    return document.evaluate(path, context, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
  } catch (error) {
    console.error(`XPath 解析错误: ${error.message}`);
    return null;
  }
}

// 获取所有匹配的元素
function getAllElementsByXpath(path, context = document) {
  try {
    return document.evaluate(path, context, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
  } catch (error) {
    console.error(`XPath 获取多个元素失败: ${error.message}`);
    return { snapshotLength: 0, snapshotItem: () => null };
  }
}

// 主函数：展开所有折叠组件并点击内部 a 标签
async function triggerAllCollapsibleLinks(options = {}) {
  const {
    delay = 500,
    maxAttempts = 1,
    verbose = true
  } = options;

  // 定义 XPath：查找所有未展开的折叠组件按钮
  const buttonXpath = '//div[contains(@class, "w-full bg-background-lighten2") and @data-state="closed"]//div[@type="button" and @data-state="closed"]';
  const buttons = getAllElementsByXpath(buttonXpath);

  if (buttons.snapshotLength === 0) {
    console.log("未找到任何未展开的折叠组件");
    return false;
  }

  if (verbose) {
    console.log(`找到 ${buttons.snapshotLength} 个未展开的折叠组件，开始操作...`);
  }

  let successCount = 0;

  // 依次处理每个折叠组件
  for (let i = 0; i < buttons.snapshotLength; i++) {
    const button = buttons.snapshotItem(i);
    let attempts = 0;
    let expanded = false;

    // 尝试展开折叠组件
    while (attempts < maxAttempts && !expanded) {
      try {
        const clickEvent = new MouseEvent('click', {
          bubbles: true,
          cancelable: true,
          view: window
        });

        button.dispatchEvent(clickEvent);

        // 等待展开动画完成
        await new Promise(resolve => setTimeout(resolve, 200));
        if (button.getAttribute('data-state') === 'open') {
          expanded = true;
          if (verbose) {
            console.log(`成功展开第 ${i + 1} 个折叠组件`);
          }
        } else {
          attempts++;
          if (verbose && attempts < maxAttempts) {
            console.log(`第 ${i + 1} 个组件展开失败，第 ${attempts} 次重试`);
          }
        }
      } catch (error) {
        console.error(`展开第 ${i + 1} 个组件时出错: ${error.message}`);
        attempts++;
      }
      await new Promise(resolve => setTimeout(resolve, delay));
    }

    if (!expanded) {
      if (verbose) console.warn(`第 ${i + 1} 个组件无法展开，跳过`);
      continue;
    }

    // 查找并点击内部的 a 标签（只点击第一个）
    const parentDiv = button.closest('.w-full.bg-background-lighten2');
    const link = parentDiv ? parentDiv.querySelector('.CollapsibleContent a') : nu吧ll;

    if (!link) {
      if (verbose) console.warn(`第 ${i + 1} 个组件内未找到 a 标签`);
      continue;
    }

    attempts = 0;
    let linkClicked = false;

    // while (attempts < maxAttempts && !linkClicked) {
    //     try {
    //         const linkClickEvent = new MouseEvent('click', {
    //             bubbles: true,
    //             cancelable: true,
    //             view: window
    //         });

    //         link.dispatchEvent(linkClickEvent);
    //         linkClicked = true;
    //         successCount++;
    //         if (verbose) {
    //             console.log(`成功点击第 ${i + 1} 个组件内的链接: ${link.href || link.textContent}`);
    //         }
    //     } catch (error) {
    //         console.error(`点击第 ${i + 1} 个链接时出错: ${error.message}`);
    //         attempts++;
    //     }
    //     await new Promise(resolve => setTimeout(resolve, delay));
    // }

    // if (!linkClicked && verbose) {
    //     console.warn(`第 ${i + 1} 个链接在 ${maxAttempts} 次尝试后仍未成功`);
    // }
  }

  if (verbose) {
    console.log(`操作完成：成功点击 ${successCount}/${buttons.snapshotLength} 个链接`);
  }
  return successCount === buttons.snapshotLength;
}

// 执行函数
(async () => {
  try {
    const success = await triggerAllCollapsibleLinks({
      delay: 500,
      maxAttempts: 3,
      verbose: true
    });

    if (success) {
      console.log("所有折叠组件内的链接操作成功完成");
    } else {
      console.warn("部分或全部链接操作失败");
    }
  } catch (error) {
    console.error(`执行出错: ${error.message}`);
  }
})();
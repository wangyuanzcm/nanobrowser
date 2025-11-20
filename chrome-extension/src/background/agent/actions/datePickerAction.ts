import { Action, ActionResult } from './action';
import { createLogger } from '@src/background/log';
import { Actors, ExecutionState } from '@src/background/executionState';
import * as z from 'zod';

const logger = createLogger('DatePickerAction');

// Schema for date picker action
const datePickerActionSchema = {
  schema: z.object({
    index: z.number().min(0).optional().describe('索引为$INDEX$的元素（时间选择器组件）'),
    date: z.string().describe('要设置的日期，格式为YYYY-MM-DD'),
    time: z.string().optional().describe('可选，要设置的时间，格式为HH:mm:ss'),
    nbId: z.string().optional().describe('可选，使用 data-nb-id 精确定位元素'),
    intent: z.string().optional().describe('操作意图'),
  }),
  description: '模拟人类操作设置各种日期时间选择器的值',
};

export class DatePickerAction extends Action {
  constructor() {
    super(DatePickerAction.execute, datePickerActionSchema);
  }

  static async execute(input: z.infer<typeof datePickerActionSchema.schema>) {
    const intent =
      input.intent ||
      (input.nbId
        ? `开始设置日期选择器: data-nb-id ${input.nbId}, 日期 ${input.date}`
        : `开始设置日期选择器: 索引 ${input.index}, 日期 ${input.date}`);

    // 获取当前页面
    const context = this.context;
    context.emitEvent(Actors.NAVIGATOR, ExecutionState.ACT_START, intent);

    try {
      const page = await context.browserContext.getCurrentPage();
      const state = await page.getCachedState();

      let result: string;
      if (input.nbId) {
        logger.info(
          `使用 data-nb-id 定位日期选择器: ${input.nbId}, 日期: ${input.date}${input.time ? `, 时间: ${input.time}` : ''}`,
        );
        try {
          result = await page.setDatePickerValueByNbId(input.nbId, input.date, input.time);
        } catch (e) {
          const errMsg = e instanceof Error ? e.message : String(e);
          context.emitEvent(Actors.NAVIGATOR, ExecutionState.ACT_FAIL, errMsg);
          logger.error(errMsg);
          return new ActionResult({ error: errMsg, includeInMemory: true });
        }
      } else if (typeof input.index === 'number') {
        logger.info(
          `使用索引定位日期选择器: ${input.index}, 日期: ${input.date}${input.time ? `, 时间: ${input.time}` : ''}`,
        );
        const elementNode = state?.selectorMap.get(input.index);
        if (!elementNode) {
          const errorMsg = `元素不存在: 索引 ${input.index}`;
          context.emitEvent(Actors.NAVIGATOR, ExecutionState.ACT_FAIL, errorMsg);
          logger.error(`日期选择器元素不存在: ${errorMsg}`);
          return new ActionResult({ error: errorMsg, includeInMemory: true });
        }
        result = await page.setDatePickerValue(input.index, input.date, input.time);
      } else {
        const errorMsg = '未提供索引或 data-nb-id，无法定位元素';
        context.emitEvent(Actors.NAVIGATOR, ExecutionState.ACT_FAIL, errorMsg);
        logger.error(errorMsg);
        return new ActionResult({ error: errorMsg, includeInMemory: true });
      }

      logger.info(`日期选择器操作完成: ${result}`);
      const okMsg = `成功设置日期选择器: ${input.date} ${input.time || ''} ${input.nbId ? `data-nb-id ${input.nbId}` : `索引 ${input.index}`}`;
      context.emitEvent(Actors.NAVIGATOR, ExecutionState.ACT_OK, okMsg);
      return new ActionResult({ extractedContent: result, includeInMemory: true });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      const errorMsg = `设置日期选择器失败: ${errorMessage}`;
      context.emitEvent(Actors.NAVIGATOR, ExecutionState.ACT_FAIL, errorMsg);
      logger.error(`设置日期选择器值失败: ${errorMessage}`);
      return new ActionResult({ error: errorMsg, includeInMemory: true });
    }
  }

  name(): string {
    return 'set_date_picker_value';
  }
}

import { useState, useEffect } from 'react';
import { type GeneralSettingsConfig, generalSettingsStore, DEFAULT_GENERAL_SETTINGS } from '@extension/storage';

interface GeneralSettingsProps {
  isDarkMode?: boolean;
}

export const GeneralSettings = ({ isDarkMode = false }: GeneralSettingsProps) => {
  const [settings, setSettings] = useState<GeneralSettingsConfig>(DEFAULT_GENERAL_SETTINGS);

  useEffect(() => {
    // 加载初始设置
    generalSettingsStore.getSettings().then(setSettings);
  }, []);

  const updateSetting = async <K extends keyof GeneralSettingsConfig>(key: K, value: GeneralSettingsConfig[K]) => {
    // 乐观更新本地状态以提高响应性
    setSettings(prevSettings => ({ ...prevSettings, [key]: value }));

    // 调用store更新设置
    await generalSettingsStore.updateSettings({ [key]: value } as Partial<GeneralSettingsConfig>);

    // 存储更新后（可能有副作用，例如useVision影响displayHighlights），
    // 再次从store获取最新设置并更新本地状态，以确保UI一致性。
    const latestSettings = await generalSettingsStore.getSettings();
    setSettings(latestSettings);
  };

  return (
    <section className="space-y-6">
      <div
        className={`rounded-lg border ${isDarkMode ? 'border-slate-700 bg-slate-800' : 'border-blue-100 bg-white'} p-6 text-left shadow-sm`}>
        <h2 className={`mb-4 text-left text-xl font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
          通用设置
        </h2>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className={`text-base font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>最大步骤数</h3>
              <p className={`text-sm font-normal ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                定义代理在放弃前可以执行的最大步骤数
              </p>
            </div>
            <label htmlFor="maxSteps" className="sr-only">
              最大步骤数
            </label>
            <input
              id="maxSteps"
              type="number"
              min={1}
              max={50}
              value={settings.maxSteps}
              onChange={e => updateSetting('maxSteps', Number.parseInt(e.target.value, 10))}
              className={`w-20 rounded-md border ${isDarkMode ? 'border-slate-600 bg-slate-700 text-gray-200' : 'border-gray-300 bg-white text-gray-700'} px-3 py-2`}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h3 className={`text-base font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                每步最大操作数
              </h3>
              <p className={`text-sm font-normal ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                定义代理在每一步中可以执行的最大操作数
              </p>
            </div>
            <label htmlFor="maxActionsPerStep" className="sr-only">
              每步最大操作数
            </label>
            <input
              id="maxActionsPerStep"
              type="number"
              min={1}
              max={50}
              value={settings.maxActionsPerStep}
              onChange={e => updateSetting('maxActionsPerStep', Number.parseInt(e.target.value, 10))}
              className={`w-20 rounded-md border ${isDarkMode ? 'border-slate-600 bg-slate-700 text-gray-200' : 'border-gray-300 bg-white text-gray-700'} px-3 py-2`}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h3 className={`text-base font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                最大失败次数
              </h3>
              <p className={`text-sm font-normal ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                定义代理在放弃前可以接受的最大连续失败次数
              </p>
            </div>
            <label htmlFor="maxFailures" className="sr-only">
              最大失败次数
            </label>
            <input
              id="maxFailures"
              type="number"
              min={1}
              max={10}
              value={settings.maxFailures}
              onChange={e => updateSetting('maxFailures', Number.parseInt(e.target.value, 10))}
              className={`w-20 rounded-md border ${isDarkMode ? 'border-slate-600 bg-slate-700 text-gray-200' : 'border-gray-300 bg-white text-gray-700'} px-3 py-2`}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h3 className={`text-base font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                启用视觉功能
              </h3>
              <p className={`text-sm font-normal ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                允许代理查看和分析屏幕内容
              </p>
            </div>
            <div className="relative inline-flex cursor-pointer items-center">
              <input
                id="useVision"
                type="checkbox"
                checked={settings.useVision}
                onChange={e => updateSetting('useVision', e.target.checked)}
                className="peer sr-only"
              />
              <label
                htmlFor="useVision"
                className={`peer h-6 w-11 rounded-full ${isDarkMode ? 'bg-slate-600' : 'bg-gray-200'} after:absolute after:left-[2px] after:top-[2px] after:size-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300`}>
                <span className="sr-only">启用视觉功能</span>
              </label>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h3 className={`text-base font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>显示高亮</h3>
              <p className={`text-sm font-normal ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                突出显示代理正在查看的屏幕区域
              </p>
            </div>
            <div className="relative inline-flex cursor-pointer items-center">
              <input
                id="displayHighlights"
                type="checkbox"
                checked={settings.displayHighlights}
                onChange={e => updateSetting('displayHighlights', e.target.checked)}
                className="peer sr-only"
              />
              <label
                htmlFor="displayHighlights"
                className={`peer h-6 w-11 rounded-full ${isDarkMode ? 'bg-slate-600' : 'bg-gray-200'} after:absolute after:left-[2px] after:top-[2px] after:size-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300`}>
                <span className="sr-only">显示高亮</span>
              </label>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h3 className={`text-base font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>规划间隔</h3>
              <p className={`text-sm font-normal ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                定义代理重新规划的步骤间隔
              </p>
            </div>
            <label htmlFor="planningInterval" className="sr-only">
              规划间隔
            </label>
            <input
              id="planningInterval"
              type="number"
              min={1}
              max={20}
              value={settings.planningInterval}
              onChange={e => updateSetting('planningInterval', Number.parseInt(e.target.value, 10))}
              className={`w-20 rounded-md border ${isDarkMode ? 'border-slate-600 bg-slate-700 text-gray-200' : 'border-gray-300 bg-white text-gray-700'} px-3 py-2`}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h3 className={`text-base font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                页面加载最小等待时间
              </h3>
              <p className={`text-sm font-normal ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                页面加载后等待的最小毫秒数
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <label htmlFor="minWaitPageLoad" className="sr-only">
                页面加载最小等待时间
              </label>
              <input
                id="minWaitPageLoad"
                type="number"
                min={250}
                max={5000}
                step={50}
                value={settings.minWaitPageLoad}
                onChange={e => updateSetting('minWaitPageLoad', Number.parseInt(e.target.value, 10))}
                className={`w-20 rounded-md border ${isDarkMode ? 'border-slate-600 bg-slate-700 text-gray-200' : 'border-gray-300 bg-white text-gray-700'} px-3 py-2`}
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h3 className={`text-base font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                重放历史任务
              </h3>
              <p className={`text-sm font-normal ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                允许代理使用以前的任务数据来改进其性能
              </p>
            </div>
            <div className="relative inline-flex cursor-pointer items-center">
              <input
                id="replayHistoricalTasks"
                type="checkbox"
                checked={settings.replayHistoricalTasks}
                onChange={e => updateSetting('replayHistoricalTasks', e.target.checked)}
                className="peer sr-only"
              />
              <label
                htmlFor="replayHistoricalTasks"
                className={`peer h-6 w-11 rounded-full ${isDarkMode ? 'bg-slate-600' : 'bg-gray-200'} after:absolute after:left-[2px] after:top-[2px] after:size-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300`}>
                <span className="sr-only">重放历史任务</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

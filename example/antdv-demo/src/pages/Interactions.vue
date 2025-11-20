<template>
  <div style="padding: 16px; max-width: 720px">
    <a-typography-title :level="3">交互示例</a-typography-title>
    <a-form >
      <a-form-item label="搜索（AntDV）">
        <a-space size="small">
          <a-input
            v-model:value="searchQuery"
            placeholder="请输入搜索关键词"
            :data-nb-id="'search_input_antdv'"
            data-nb-action="input_text"
            data-nb-role="search-input"
            style="width: 240px"
          />
          <a-button
            type="primary"
            :data-nb-id="'search_button_antdv'"
            data-nb-action="click"
            data-nb-role="button"
            @click="onSearch"
          >搜索</a-button>
        </a-space>
      </a-form-item>
      <a-form-item label="多选选择（AntDV Select 多选）">
        <a-select
          v-model:value="selectedCities"
          mode="multiple"
          placeholder="请选择城市"
          style="width: 240px"
          :data-nb-id="'city_select_antdv_multi'"
          data-nb-action="select_dropdown_option"
          data-nb-role="dropdown"
        >
          <a-select-option value="北京">北京</a-select-option>
          <a-select-option value="上海">上海</a-select-option>
          <a-select-option value="深圳">深圳</a-select-option>
          <a-select-option value="杭州">杭州</a-select-option>
          <a-select-option value="成都">成都</a-select-option>
          <a-select-option value="武汉">武汉</a-select-option>
        </a-select>
      </a-form-item>

      <a-form-item label="输入数字（AntDV InputNumber）">
        <a-input-number
          v-model:value="numberVal"
          :min="0"
          :step="1"
          style="width: 240px"
          :data-nb-id="'input_number_antdv'"
          data-nb-action="input_text"
          data-nb-role="number-input"
        />
      </a-form-item>

      <a-form-item label="文本域（AntDV TextArea）">
        <a-textarea
          v-model:value="textAreaVal"
          rows="3"
          style="width: 240px"
          :data-nb-id="'textarea_antdv'"
          data-nb-action="input_text"
          data-nb-role="textarea"
        />
      </a-form-item>

      <a-form-item label="开关（AntDV Switch）">
        <a-switch
          v-model:checked="switchOn"
          :data-nb-id="'switch_antdv'"
          data-nb-action="click"
          data-nb-role="switch"
        />
      </a-form-item>

      <a-form-item label="单选（AntDV RadioGroup）">
        <a-radio-group v-model:value="radioVal">
          <a-radio :value="'A'" :data-nb-id="'radio_A'" data-nb-action="click">A</a-radio>
          <a-radio :value="'B'" :data-nb-id="'radio_B'" data-nb-action="click">B</a-radio>
          <a-radio :value="'C'" :data-nb-id="'radio_C'" data-nb-action="click">C</a-radio>
        </a-radio-group>
      </a-form-item>

      <a-form-item label="复选（AntDV Checkbox）">
        <a-space size="small">
          <a-checkbox :checked="checkboxVals.includes('X')" @change="onCheck('X', $event)" :data-nb-id="'checkbox_X'" data-nb-action="click">X</a-checkbox>
          <a-checkbox :checked="checkboxVals.includes('Y')" @change="onCheck('Y', $event)" :data-nb-id="'checkbox_Y'" data-nb-action="click">Y</a-checkbox>
          <a-checkbox :checked="checkboxVals.includes('Z')" @change="onCheck('Z', $event)" :data-nb-id="'checkbox_Z'" data-nb-action="click">Z</a-checkbox>
        </a-space>
      </a-form-item>

      <a-form-item label="搜索（原生控件）">
        <a-space size="small">
          <input
            id="searchInputNative"
            v-model="searchQuery"
            placeholder="请输入搜索关键词"
            data-nb-id="search_input_native"
            data-nb-action="input_text"
            data-nb-role="search-input"
            style="width: 240px; padding: 6px 10px; border: 1px solid #d9d9d9; border-radius: 6px;"
          />
          <button
            id="submitButtonNative"
            data-nb-id="submit_button_native"
            data-nb-action="click"
            data-nb-role="submit-button"
            @click="onSearch"
            style="padding: 6px 16px; border: 1px solid #1677ff; background: #1677ff; color: #fff; border-radius: 6px;"
          >搜索</button>
        </a-space>
      </a-form-item>

      <a-form-item label="出生日期（AntDV DatePicker/TimePicker）">
        <a-space size="small">
          <div data-nb-id="birth_date_antdv" data-nb-action="set_date_picker_value" data-nb-role="date-picker" data-nb-format="YYYY-MM-DD">
            <a-date-picker
              v-model:value="birthDate"
              format="YYYY-MM-DD"
              valueFormat="YYYY-MM-DD"
            />
          </div>
          <div data-nb-id="birth_time_antdv" data-nb-action="set_date_picker_value" data-nb-role="time-picker" data-nb-format="HH:mm:ss">
            <a-time-picker
              v-model:value="birthTime"
              format="HH:mm:ss"
              valueFormat="HH:mm:ss"
            />
          </div>
        </a-space>
      </a-form-item>

      <a-form-item label="出生日期（原生控件）">
        <input
          id="birthDateNative"
          v-model="birthDateNative"
          type="date"
          data-nb-id="birth_date_native"
          data-nb-action="set_date_picker_value"
          data-nb-role="date-picker"
          data-nb-format="YYYY-MM-DD"
          style="width: 240px; padding: 6px 10px; border: 1px solid #d9d9d9; border-radius: 6px;"
        />
      </a-form-item>

      <a-form-item label="城市选择（AntDV Select）">
        <a-select
          v-model:value="city"
          placeholder="请选择城市"
          style="width: 240px"
          :data-nb-id="'city_select_antdv'"
          data-nb-action="select_dropdown_option"
          data-nb-role="dropdown"
        >
          <a-select-option value="北京">北京</a-select-option>
          <a-select-option value="上海">上海</a-select-option>
          <a-select-option value="深圳">深圳</a-select-option>
          <a-select-option value="杭州">杭州</a-select-option>
          <a-select-option value="成都">成都</a-select-option>
          <a-select-option value="武汉">武汉</a-select-option>
        </a-select>
      </a-form-item>

      <a-form-item label="城市选择（原生控件）">
        <select
          id="citySelectNative"
          v-model="cityNative"
          data-nb-id="city_select_native"
          data-nb-action="select_dropdown_option"
          data-nb-role="dropdown"
          style="width: 240px; padding: 6px 10px; border: 1px solid #d9d9d9; border-radius: 6px;"
        >
          <option>北京</option>
          <option>上海</option>
          <option>深圳</option>
          <option>杭州</option>
          <option>成都</option>
          <option>武汉</option>
        </select>
      </a-form-item>
    </a-form>

    <a-typography-title :level="5" style="margin-top: 12px">当前表单值</a-typography-title>
    <pre>{{ statePreview }}</pre>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue';

const searchQuery = ref('');
const birthDate = ref<string | null>(null);
const birthTime = ref<string | null>(null);
const birthDateNative = ref<string>('');
const city = ref<string | undefined>();
const cityNative = ref<string>('北京');
const selectedCities = ref<string[]>([]);
const numberVal = ref<number | null>(null);
const textAreaVal = ref('');
const switchOn = ref<boolean>(false);
const radioVal = ref<string | null>(null);
const checkboxVals = ref<string[]>([]);

const onSearch = () => {
  console.log('search:', searchQuery.value);
};

const onCheck = (val: string, e: any) => {
  const checked = !!(e && e.target && e.target.checked);
  const set = new Set(checkboxVals.value);
  if (checked) set.add(val); else set.delete(val);
  checkboxVals.value = Array.from(set);
};

const statePreview = computed(() => ({
  searchQuery: searchQuery.value,
  birthDate,
  birthTime,
  birthDateNative: birthDateNative.value,
  city,
  cityNative: cityNative.value,
  selectedCities: selectedCities.value,
  numberVal,
  textAreaVal,
  switchOn: switchOn.value,
  radioVal: radioVal.value,
  checkboxVals: checkboxVals.value
}));
</script>

<style>
body { background: #f5f5f5; }
</style>

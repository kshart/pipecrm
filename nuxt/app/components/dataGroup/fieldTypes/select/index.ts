import type { IFieldConfig, IFieldTypeModule } from '../types'
import FieldViewer from './FieldViewer.vue'
import FieldEditor from './FieldEditor.vue'

/**
 * @see https://vuetifyjs.com/en/components/selects
 */
export type FieldConfigSelect = IFieldConfig<'select', {
  options: string[]
  vConf?: {
    multiple?: boolean
    clearable?: boolean
  }
}>

export default {
  name: 'select',
  FieldViewer,
  FieldEditor,
  createNew () {
    return {
      options: [],
      vConf: undefined,
    }
  },
} as IFieldTypeModule<'select', FieldConfigSelect>

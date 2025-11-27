import type { IFieldConfig, IFieldTypeModule } from '../types'
import FieldViewer from './FieldViewer.vue'
import FieldEditor from './FieldEditor.vue'

/**
 * @see https://vuetifyjs.com/en/api/v-text-field/
 */
export type FieldConfigString = IFieldConfig<'string', {
  isTextarea: boolean
  vConf?: {
    type?: string
    clearable?: boolean
  }
}>

export default {
  name: 'string',
  FieldViewer,
  FieldEditor,
  createNew () {
    return {
      isTextarea: false,
      vConf: undefined,
    }
  },
} as IFieldTypeModule<'string', FieldConfigString>

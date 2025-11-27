import type { IFieldConfig, IFieldTypeModule } from '../types'
import FieldViewer from './FieldViewer.vue'
import FieldEditor from './FieldEditor.vue'

/**
 * @see https://vuetifyjs.com/en/api/v-number-input/
 */
export type FieldConfigPhone = IFieldConfig<'phone', {

}>

export default {
  name: 'phone',
  FieldViewer,
  FieldEditor,
  createNew () {
    return {
    }
  },
} as IFieldTypeModule<'phone', FieldConfigPhone>

import type { IFieldConfig, IFieldTypeModule } from '../types'
import FieldViewer from './FieldViewer.vue'
import FieldEditor from './FieldEditor.vue'

/**
 * @see https://vuetifyjs.com/en/api/v-number-input/
 */
export type FieldConfigNumber = IFieldConfig<'number', {

}>

export default {
  name: 'number',
  FieldViewer,
  FieldEditor,
  createNew () {
    return {
    }
  },
} as IFieldTypeModule<'number', FieldConfigNumber>

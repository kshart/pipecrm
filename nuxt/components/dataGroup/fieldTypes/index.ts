import type { FieldConfigString } from './string'
import string from './string'

import type { FieldConfigPhone } from './phone'
import phone from './phone'

import type { FieldConfigNumber } from './number'
import number from './number'

import type { FieldConfigSelect } from './select'
import select from './select'

export type FieldConfig = FieldConfigString | FieldConfigPhone | FieldConfigNumber | FieldConfigSelect

export default [
  string,
  phone,
  number,
  select,
]

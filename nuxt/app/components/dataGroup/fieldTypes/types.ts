export interface IFieldConfig<TypeT extends string, ConfigT extends object> {
  uuid: string
  title: string
  type: TypeT
  config: ConfigT
}

export interface IFieldTypeModule<TypeT extends string, TFieldConfig extends IFieldConfig<string, object>> {
  name: TypeT
  FieldViewer: Component
  FieldEditor: Component
  createNew: () => TFieldConfig['config']
}

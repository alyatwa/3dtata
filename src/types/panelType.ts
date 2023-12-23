export interface ControlValues {
	type: 'color' | 'number';
	min?: number;
	max?: number;
	step?: number;
	defaultValue: any;
	name: string;
  }
  
  export interface ControlDefinitions {
	[key: string | number]: ControlValues;
  }
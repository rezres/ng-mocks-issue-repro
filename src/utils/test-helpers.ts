import { Component, EventEmitter, forwardRef, Injector, reflectComponentType, Type } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';


export const MockOf = (mockClass: Type<any>, outputs?: string[]) => (constructor: Type<any>) => {
	Object.defineProperties(constructor, {
		mockOf: { value: mockClass },
		name: { value: `MockOf${mockClass.name}` },
		nameConstructor: { value: constructor.name },
	});

	const mockedOutputs = [];
	for (const output of outputs || []) {
		mockedOutputs.push(output.split(':')[0]);
	}
	constructor.prototype.__mockedOutputs = mockedOutputs;
};

export function WrapComponent<TComponent>(component: Type<TComponent>): Type<TComponent> {
	const metadata = reflectComponentType(component)!;
	const inputs = (metadata?.inputs || []).map(t => t.propName);
	const outputs = (metadata?.outputs || []).map(output => output.propName);

	const options: Component = {
		inputs: inputs,
		outputs: outputs,
		providers: [
			{
				multi: true,
				provide: NG_VALUE_ACCESSOR,
				useExisting: forwardRef(() => ComponentMock),
			},
		],
		selector: `${metadata.selector}-wrapper`,
		template: `
            <${metadata.selector}
                ${inputs.map((input: string) => `[${input}]="${input}"`).join(' ')}
                ${outputs.map((output: string) => `(${output})="${output}Hanlder($event)"`).join(' ')}
            >
            </${metadata.selector}>
        `,
	};

	@MockOf(component)
	class ComponentMock {
		constructor() {
			outputs.forEach((output: string) => {
				const self = this as { [key: string]: any };
				const handler = `${output}Hanlder`;

				self[output] = new EventEmitter<any>();
				self[handler] = ($event: any) => self[output].emit($event);
			});
		}

		mockOf = component;
	}

	const mockedWrapper = Component(options)((<any>ComponentMock) as Type<TComponent>);


	return mockedWrapper as any;
}

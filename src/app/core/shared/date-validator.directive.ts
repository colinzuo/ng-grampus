import { ValidatorFn, AbstractControl } from '@angular/forms';

export function dateValidator(): ValidatorFn {
    return (control: AbstractControl): {[key: string]: any} | null => {
      const parseResult = Date.parse(control.value);
      if (isNaN(parseResult)) {
        return {'date': {value: control.value}};
      } else {
        return null;
      }
    };
  }

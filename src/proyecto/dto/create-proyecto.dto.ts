import { Transform } from 'class-transformer';
import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  Validate,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

@ValidatorConstraint({ name: 'isAfterOrEqualDate', async: false })
export class IsAfterOrEqualDateConstraint implements ValidatorConstraintInterface {
  validate(fechaFinalizacion: string | undefined, args: ValidationArguments): boolean {
    if (!fechaFinalizacion) return true;

    const { fechaInicio } = args.object as { fechaInicio?: string };
    if (!fechaInicio) return true;

    // Comparación segura para fechas en formato YYYY-MM-DD
    return fechaFinalizacion >= fechaInicio;
  }

  defaultMessage(): string {
    return 'fechaFinalizacion debe ser igual o posterior a fechaInicio (formato YYYY-MM-DD)';
  }
}

export class CreateProyectoDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  nombre!: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  descripcion?: string;

  @IsDateString()
  fechaInicio!: string;

  @IsOptional()
  @IsDateString()
  @Validate(IsAfterOrEqualDateConstraint)
  fechaFinalizacion?: string;
}
import type { ReactNode } from 'react';
import type { SceneSelection } from '@/data/scene';

export type SceneAction = (selection: SceneSelection, button: HTMLButtonElement) => void;

export function SceneButton({selection,label,className='',onSelect,children}:{
  selection:SceneSelection;
  label:string;
  className?:string;
  onSelect:SceneAction;
  children?:ReactNode;
}) {
  return <button
    type="button"
    className={`scene-object ${className}`}
    data-facility={selection.facility}
    data-object-id={selection.itemId ?? 'overview'}
    aria-label={`${label} · ${selection.facility}`}
    aria-haspopup="dialog"
    onClick={event=>onSelect(selection,event.currentTarget)}
  >{children}<span className="object-label">{label}</span></button>;
}

export function AssetCrop({src,viewBox,sourceWidth,sourceHeight,className=''}:{
  src:string;viewBox:string;sourceWidth:number;sourceHeight:number;className?:string;
}) {
  return <svg className={className} viewBox={viewBox} aria-hidden="true" focusable="false" preserveAspectRatio="xMidYMid meet" overflow="hidden">
    <image href={src} width={sourceWidth} height={sourceHeight}/>
  </svg>;
}

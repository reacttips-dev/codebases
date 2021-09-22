import getStore from '../store/store';
import { Module } from 'owa-workloads';

export default function getCurrentModule(): Module | undefined {
    return getStore().module;
}

export interface ProjectDisplayerInterface {
    displayProject(): void;
    onProjectHideDisplay(): void;
}

export interface ProjectDisplayer {
    displayer: ProjectDisplayerInterface;
    displayed: HTMLElement;
}

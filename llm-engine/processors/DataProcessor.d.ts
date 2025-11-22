export declare class DataProcessor {
    private cacheDir;
    private processedDir;
    constructor();
    /**
     * Process all cached JSON files and convert them to training-ready format
     */
    processAllModules(): Promise<void>;
    /**
     * Process a single module file
     */
    private processModuleFile;
    /**
     * Process individual module data
     */
    private processModule;
    /**
     * Format module content for LLM training
     */
    private formatModuleContent;
    /**
     * Generate unique ID for module
     */
    private generateModuleId;
    /**
     * Detect changes in modules
     */
    detectChanges(): {
        added: number;
        updated: number;
        removed: number;
    };
}
//# sourceMappingURL=DataProcessor.d.ts.map
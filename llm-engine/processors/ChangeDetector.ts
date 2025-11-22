import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';
import { KnowledgeModule } from '../schemas/knowledgeModule.schema';

export class ChangeDetector {
  private cacheDir: string;
  private processedDir: string;
  private versionsDir: string;

  constructor() {
    this.cacheDir = path.join(__dirname, '..', 'cache');
    this.processedDir = path.join(__dirname, '..', 'processed');
    this.versionsDir = path.join(__dirname, '..', 'versions');
    
    // Create versions directory if it doesn't exist
    if (!fs.existsSync(this.versionsDir)) {
      fs.mkdirSync(this.versionsDir, { recursive: true });
    }
  }

  /**
   * Compute checksum of raw content
   */
  computeChecksum(content: string): string {
    return crypto.createHash('md5').update(content).digest('hex');
  }

  /**
   * Detect changes in modules
   */
  async detectChanges(): Promise<{ added: number; updated: number; removed: number }> {
    try {
      const stats = {
        added: 0,
        updated: 0,
        removed: 0
      };

      // Read processed modules
      if (!fs.existsSync(this.processedDir)) {
        return stats;
      }

      const files = fs.readdirSync(this.processedDir);
      const jsonFiles = files.filter(file => file.endsWith('-processed.json'));

      for (const file of jsonFiles) {
        const filePath = path.join(this.processedDir, file);
        const rawData = fs.readFileSync(filePath, 'utf-8');
        const modules: KnowledgeModule[] = JSON.parse(rawData);

        for (const module of modules) {
          // Ensure module has an ID
          if (!module.id) {
            console.warn('Module missing ID, skipping change detection');
            continue;
          }

          // Compute checksum of module content
          const content = JSON.stringify({
            title: module.title,
            source_body: module.source_body,
            workflows: module.workflows,
            required_documents: module.required_documents
          });

          const currentChecksum = this.computeChecksum(content);

          // Check if we have a previous version
          const versionPath = path.join(this.versionsDir, module.id + '_v' + (module.version || '1.0') + '.json');
          
          if (!fs.existsSync(versionPath)) {
            // New module
            stats.added++;
            
            // Save current version
            this.saveModuleVersion(module, currentChecksum);
            
            // Log the addition
            this.logChange('added', module.id, 'New module detected');
          } else {
            // Check if module has changed
            const versionData = fs.readFileSync(versionPath, 'utf-8');
            const versionInfo = JSON.parse(versionData);
            
            if (versionInfo.checksum !== currentChecksum) {
              // Module has changed
              stats.updated++;
              
              // Save previous version
              const previousVersionPath = path.join(this.versionsDir, module.id + '_v' + (module.version || '1.0') + '_prev.json');
              fs.copyFileSync(versionPath, previousVersionPath);
              
              // Save current version
              this.saveModuleVersion(module, currentChecksum);
              
              // Check for major changes
              const majorChange = this.detectMajorChange(versionInfo.module, module);
              if (majorChange) {
                // Mark module as requiring review
                this.markForReview(module.id);
                
                // Log the major change
                this.logChange('updated', module.id, 'Major content change detected, requires review');
              } else {
                // Log the update
                this.logChange('updated', module.id, 'Content updated');
              }
            }
          }
        }
      }

      return stats;
    } catch (error) {
      console.error('Error detecting changes:', error);
      return {
        added: 0,
        updated: 0,
        removed: 0
      };
    }
  }

  /**
   * Save module version with checksum
   */
  private saveModuleVersion(module: KnowledgeModule, checksum: string): void {
    try {
      const versionInfo = {
        module: module,
        checksum: checksum,
        timestamp: new Date().toISOString()
      };
      
      const versionPath = path.join(this.versionsDir, module.id + '_v' + (module.version || '1.0') + '.json');
      fs.writeFileSync(versionPath, JSON.stringify(versionInfo, null, 2));
    } catch (error) {
      console.error('Error saving version for module ' + module.id + ':', error);
    }
  }

  /**
   * Detect major changes in module content
   */
  private detectMajorChange(oldModule: KnowledgeModule, newModule: KnowledgeModule): boolean {
    try {
      // Check content length difference
      const oldContentLength = oldModule.source_body?.length || 0;
      const newContentLength = newModule.source_body?.length || 0;
      
      if (oldContentLength > 0 && newContentLength > 0) {
        const lengthDiff = Math.abs(oldContentLength - newContentLength) / oldContentLength;
        if (lengthDiff > 0.15) { // 15% difference
          return true;
        }
      }
      
      // Check workflow step count difference
      const oldStepCount = oldModule.workflows?.length || 0;
      const newStepCount = newModule.workflows?.length || 0;
      
      if (oldStepCount !== newStepCount) {
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error detecting major change:', error);
      return false;
    }
  }

  /**
   * Mark module as requiring review
   */
  private markForReview(moduleId: string): void {
    try {
      // In a real implementation, this would update the module in the database
      // For now, we'll just log it
      console.log('Module ' + moduleId + ' marked for review due to major changes');
      
      // Create admin notification
      this.createAdminNotification(moduleId, 'Module requires review due to major content changes');
    } catch (error) {
      console.error('Error marking module ' + moduleId + ' for review:', error);
    }
  }

  /**
   * Create admin notification
   */
  private createAdminNotification(moduleId: string, message: string): void {
    try {
      // In a real implementation, this would insert a record into the scraper_logs table
      // For now, we'll just log it
      console.log('Admin notification: ' + message + ' for module ' + moduleId);
    } catch (error) {
      console.error('Error creating admin notification:', error);
    }
  }

  /**
   * Log change to scraper logs
   */
  private logChange(changeType: string, moduleId: string, message: string): void {
    try {
      // In a real implementation, this would insert a record into the scraper_logs table
      // For now, we'll just log it
      console.log('Change detected: ' + changeType + ' - ' + moduleId + ' - ' + message);
    } catch (error) {
      console.error('Error logging change:', error);
    }
  }

  /**
   * Get module version history
   */
  getModuleHistory(moduleId: string): any[] {
    try {
      const history: any[] = [];
      
      if (!fs.existsSync(this.versionsDir)) {
        return history;
      }
      
      const files = fs.readdirSync(this.versionsDir);
      const moduleFiles = files.filter(file => 
        file.startsWith(moduleId + '_v') && file.endsWith('.json')
      );
      
      for (const file of moduleFiles) {
        const filePath = path.join(this.versionsDir, file);
        const data = fs.readFileSync(filePath, 'utf-8');
        const versionInfo = JSON.parse(data);
        history.push(versionInfo);
      }
      
      // Sort by timestamp (newest first)
      history.sort((a, b) => 
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );
      
      return history;
    } catch (error) {
      console.error('Error getting history for module ' + moduleId + ':', error);
      return [];
    }
  }
}
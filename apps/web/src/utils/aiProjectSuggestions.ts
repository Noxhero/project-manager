// AI-powered project and task suggestions

interface TaskSuggestion {
  title: string;
  description: string;
  priority: "LOW" | "MEDIUM" | "HIGH";
  estimatedHours?: number;
  category: "planning" | "development" | "design" | "testing" | "deployment" | "documentation";
}

interface GraphSuggestion {
  fromProject: string;
  toProject: string;
  relationship: "DEPENDS_ON" | "SIMILAR_TO" | "SHARES_RESOURCES_WITH" | "PRECEDES";
  confidence: number;
  reason: string;
}

export class AIProjectAssistant {
  
  // Generate intelligent task suggestions based on project description
  static generateTaskSuggestions(projectName: string, description: string, objectives: string[], tags: string[]): TaskSuggestion[] {
    const suggestions: TaskSuggestion[] = [];
    const lowerDesc = description.toLowerCase();
    const lowerTags = tags.map(t => t.toLowerCase());
    
    // Planning phase tasks
    suggestions.push({
      title: "Définir l'architecture technique",
      description: "Choisir les technologies, frameworks et structure du projet",
      priority: "HIGH",
      estimatedHours: 4,
      category: "planning"
    });
    
    suggestions.push({
      title: "Créer le cahier des charges",
      description: "Documenter les spécifications fonctionnelles et techniques",
      priority: "HIGH", 
      estimatedHours: 6,
      category: "planning"
    });
    
    // Design tasks (if design-related)
    if (lowerDesc.includes("design") || lowerDesc.includes("ui") || lowerDesc.includes("interface") || lowerTags.includes("design")) {
      suggestions.push({
        title: "Créer les maquettes UI/UX",
        description: "Design des interfaces utilisateur et parcours",
        priority: "HIGH",
        estimatedHours: 8,
        category: "design"
      });
      
      suggestions.push({
        title: "Définir la charte graphique",
        description: "Couleurs, typographie, composants visuels",
        priority: "MEDIUM",
        estimatedHours: 4,
        category: "design"
      });
    }
    
    // Development tasks
    if (lowerDesc.includes("web") || lowerDesc.includes("app") || lowerTags.includes("web") || lowerTags.includes("mobile")) {
      suggestions.push({
        title: "Mettre en place l'environnement de développement",
        description: "Configuration des outils, CI/CD, repository",
        priority: "HIGH",
        estimatedHours: 3,
        category: "development"
      });
      
      suggestions.push({
        title: "Développer les fonctionnalités core",
        description: "Implémentation des principales fonctionnalités",
        priority: "HIGH",
        estimatedHours: 20,
        category: "development"
      });
    }
    
    // Database tasks
    if (lowerDesc.includes("base de données") || lowerDesc.includes("database") || lowerDesc.includes("data")) {
      suggestions.push({
        title: "Concevoir le schéma de base de données",
        description: "Modélisation des entités et relations",
        priority: "HIGH",
        estimatedHours: 6,
        category: "development"
      });
    }
    
    // API tasks
    if (lowerDesc.includes("api") || lowerDesc.includes("backend") || lowerDesc.includes("service")) {
      suggestions.push({
        title: "Développer les endpoints API",
        description: "Création des routes REST/GraphQL",
        priority: "HIGH",
        estimatedHours: 12,
        category: "development"
      });
      
      suggestions.push({
        title: "Implémenter l'authentification",
        description: "JWT, OAuth2, gestion des permissions",
        priority: "HIGH",
        estimatedHours: 8,
        category: "development"
      });
    }
    
    // Testing tasks
    suggestions.push({
      title: "Mettre en place les tests unitaires",
      description: "Tests des fonctions et composants principaux",
      priority: "MEDIUM",
      estimatedHours: 10,
      category: "testing"
    });
    
    suggestions.push({
      title: "Réaliser les tests d'intégration",
      description: "Tests des flux et interactions entre modules",
      priority: "MEDIUM",
      estimatedHours: 8,
      category: "testing"
    });
    
    // Documentation tasks
    suggestions.push({
      title: "Rédiger la documentation technique",
      description: "README, architecture, guides d'utilisation",
      priority: "MEDIUM",
      estimatedHours: 6,
      category: "documentation"
    });
    
    // Deployment tasks
    suggestions.push({
      title: "Préparer le déploiement",
      description: "Configuration Docker, CI/CD, hébergement",
      priority: "MEDIUM",
      estimatedHours: 8,
      category: "deployment"
    });
    
    // Project-specific suggestions based on objectives
    objectives.forEach((objective, index) => {
      if (objective.toLowerCase().includes("mobile")) {
        suggestions.push({
          title: `Objectif ${index + 1}: Développement mobile`,
          description: `Adapter l'application pour mobile: responsive design, PWA, ou app native`,
          priority: "HIGH",
          estimatedHours: 16,
          category: "development"
        });
      }
      
      if (objective.toLowerCase().includes("performance")) {
        suggestions.push({
          title: `Objectif ${index + 1}: Optimisation performance`,
          description: "Analyse et optimisation des temps de chargement, lazy loading, caching",
          priority: "MEDIUM",
          estimatedHours: 12,
          category: "development"
        });
      }
    });
    
    // Sort by priority and add some randomness for variety
    return suggestions
      .sort((a, b) => {
        const priorityOrder = { HIGH: 3, MEDIUM: 2, LOW: 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      })
      .slice(0, 8 + Math.floor(Math.random() * 4)); // 8-12 tasks
  }
  
  // Generate graph relationship suggestions
  static generateGraphSuggestions(projects: any[]): GraphSuggestion[] {
    const suggestions: GraphSuggestion[] = [];
    
    for (let i = 0; i < projects.length; i++) {
      for (let j = i + 1; j < projects.length; j++) {
        const project1 = projects[i];
        const project2 = projects[j];
        
        // Check for similar tags
        const commonTags = project1.tags.filter((tag: string) => 
          project2.tags.includes(tag)
        );
        
        if (commonTags.length > 0) {
          suggestions.push({
            fromProject: project1._id,
            toProject: project2._id,
            relationship: "SIMILAR_TO",
            confidence: 0.7 + (commonTags.length * 0.1),
            reason: `Projets similaires: tags communs (${commonTags.join(", ")})`
          });
        }
        
        // Check for potential dependencies based on descriptions
        const desc1 = project1.description.toLowerCase();
        const desc2 = project2.description.toLowerCase();
        
        if (desc1.includes("api") && desc2.includes("frontend")) {
          suggestions.push({
            fromProject: project2._id,
            toProject: project1._id,
            relationship: "DEPENDS_ON",
            confidence: 0.8,
            reason: "Le frontend dépend de l'API"
          });
        }
        
        if (desc1.includes("base de données") && (desc2.includes("application") || desc2.includes("service"))) {
          suggestions.push({
            fromProject: project2._id,
            toProject: project1._id,
            relationship: "DEPENDS_ON",
            confidence: 0.75,
            reason: "L'application utilise la base de données"
          });
        }
        
        // Check for shared resources
        if (project1.createdBy === project2.createdBy) {
          suggestions.push({
            fromProject: project1._id,
            toProject: project2._id,
            relationship: "SHARES_RESOURCES_WITH",
            confidence: 0.6,
            reason: "Projets du même auteur - ressources partagées possibles"
          });
        }
      }
    }
    
    return suggestions.sort((a, b) => b.confidence - a.confidence).slice(0, 10);
  }
  
  // Generate project improvement suggestions
  static generateImprovementSuggestions(project: any): string[] {
    const suggestions: string[] = [];
    const desc = project.description.toLowerCase();
    const tags = project.tags.map((t: string) => t.toLowerCase());
    
    // Check for missing common elements
    if (!desc.includes("test") && !tags.includes("testing")) {
      suggestions.push("Ajoutez une phase de testing pour garantir la qualité");
    }
    
    if (!desc.includes("document") && !tags.includes("documentation")) {
      suggestions.push("Pensez à documenter votre projet pour une meilleure maintenabilité");
    }
    
    if (!desc.includes("deploy") && !tags.includes("deployment")) {
      suggestions.push("Planifiez la stratégie de déploiement dès le début");
    }
    
    if (project.objectives.length < 3) {
      suggestions.push("Ajoutez plus d'objectifs pour mieux structurer votre projet");
    }
    
    if (!project.deadline) {
      suggestions.push("Définissez une deadline pour mieux planifier votre travail");
    }
    
    // Technology-specific suggestions
    if (tags.includes("react") && !tags.includes("testing")) {
      suggestions.push("Utilisez React Testing Library et Jest pour vos tests React");
    }
    
    if (tags.includes("node") && !tags.includes("security")) {
      suggestions.push("Pensez à la sécurité: validation, authentification, HTTPS");
    }
    
    return suggestions;
  }
}

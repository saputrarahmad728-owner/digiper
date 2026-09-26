import React from 'react';
import { Tag, Bug, Leaf, Droplet, Warehouse, Sparkles, Sprout } from 'lucide-react';

interface QuickTagsProps {
  selectedTag: string;
  onSelectTag: (tag: string) => void;
  tagCounts: Record<string, number>;
}

export const CATEGORIES = [
  { id: 'all', tag: 'Semua', label: 'Semua Topik', icon: Sparkles },
  { id: 'hama', tag: 'Hama Tanaman', label: 'Hama Tanaman', icon: Bug },
  { id: 'pupuk', tag: 'Pupuk Organik', label: 'Pupuk Organik', icon: Leaf },
  { id: 'hidroponik', tag: 'Hidroponik', label: 'Hidroponik', icon: Droplet },
  { id: 'pascapanen', tag: 'Pascapanen', label: 'Pascapanen', icon: Warehouse },
  { id: 'bibit', tag: 'Bibit Unggul', label: 'Bibit Unggul', icon: Sprout }
];

export const QuickTags: React.FC<QuickTagsProps> = ({
  selectedTag,
  onSelectTag,
  tagCounts
}) => {
  return (
    <section className="quick-tags-section">
      <div className="container">
        <div className="quick-tags-wrapper">
          <div className="tag-label">
            <Tag size={16} />
            <span>Kategori:</span>
          </div>

          {CATEGORIES.map((item) => {
            const Icon = item.icon;
            const isActive = selectedTag === item.tag;
            const count = tagCounts[item.tag] || 0;

            return (
              <button
                key={item.id}
                type="button"
                className={`tag-pill ${isActive ? 'active' : ''}`}
                onClick={() => onSelectTag(item.tag)}
                id={`tag-pill-${item.id}`}
              >
                <Icon size={15} />
                <span>{item.label}</span>
                {count > 0 && <span className="tag-count">{count}</span>}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};

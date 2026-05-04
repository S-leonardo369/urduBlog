import { config, collection, fields } from '@keystatic/core';

// Update these two values to match your GitHub repo before deploying.
const GITHUB_OWNER = 'S-leonardo369';
const GITHUB_REPO  = 'urduBlog';

export default config({
  storage: {
    // In dev, use local storage (no GitHub auth needed).
    // On the deployed site, switch to 'github'.
    kind: import.meta.env.DEV ? 'local' : 'github',
    repo: { owner: GITHUB_OWNER, name: GITHUB_REPO },
  },

  ui: {
    brand: { name: 'روشنائی' },
  },

  collections: {
    posts: collection({
      label: 'تحریریں',
      slugField: 'title',
      path: 'src/content/posts/*',
      format: { contentField: 'md' },
      entryLayout: 'content',
      schema: {
        title: fields.slug({
          name: {
            label: 'عنوان',
            validation: { isRequired: true },
          },
        }),

        date: fields.date({
          label: 'تاریخ',
          validation: { isRequired: true },
          defaultValue: { kind: 'today' },
        }),

        description: fields.text({
          label: 'تفصیل',
          multiline: true,
        }),

        tags: fields.array(
          fields.text({ label: 'ٹیگ' }),
          {
            label: 'ٹیگز',
            itemLabel: (props) => props.value || 'نیا ٹیگ',
          }
        ),

        cover: fields.image({
          label: 'تصویر',
          directory: 'public/images/posts',
          publicPath: '/images/posts/',
        }),

        content: fields.markdoc({
          label: 'تحریر',
          options: {
            image: {
              directory: 'public/images/posts',
              publicPath: '/images/posts/',
            },
          },
        }),
      },
    }),
  },
});

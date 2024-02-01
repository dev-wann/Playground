import styles from './Folder.module.css';

export default function Content({ page }: { page: number }) {
  const content = (
    <div className={styles.item}>
      <h2>
        <span className={styles.highlight}>Project Name</span>
        <span className={styles.affilation}>@Company</span>
      </h2>
      <div className={styles.itemCoverImg}>
        <div />
        <div />
      </div>
      <div className={styles.desc}>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloremque
        perspiciatis corrupti magni nostrum voluptatum voluptatem. Aperiam
        tempora error, deleniti sed nostrum sit nisi numquam, eveniet odio saepe
        ullam atque non tempore cupiditate facere perferendis minima
        reprehenderit exercitationem earum dignissimos ea velit. Asperiores
        molestias, aut sequi distinctio recusandae beatae qui dolorum ex maxime
        reprehenderit ullam ab tempora dolores blanditiis voluptates deleniti.
      </div>
    </div>
  );

  return (
    <div className={styles.page}>
      <div>
        <div className={styles.index}>
          <p>&nbsp;Project #{page}</p>
        </div>
        {content}
      </div>
      <div>
        <div className={styles.index}></div>
      </div>
    </div>
  );
}

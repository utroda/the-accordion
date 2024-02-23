<script setup>
  import TheAccordion from './components/TheAccordion.vue'

  const sections = [
    {
      slug: 'section-1',
      heading: 'Section 1',
      content: 'Content for section 1'
    },
    {
      slug: 'section-2',
      heading: 'Section 2',
      content: 'Content for section 2'
    },
    {
      slug: 'section-3',
      heading: 'Section 3',
      content: 'Content for section 3'
    }
  ];
</script>

<template>
  <h2>The Accordion</h2>
  <TheAccordion
    :sections="sections"
  />
  <hr />
  <h2>With Default Open</h2>
  <TheAccordion
    :sections="sections"
    :initialOpen="sections[1].slug"
  />
  <hr />
  <h2>H3 used for heading</h2>
  <TheAccordion 
    :sections="sections"
    headingAs="h3"
  />
  <hr />
  <h2>Complex Layouts (Slots)</h2>
  <TheAccordion 
    :sections="sections"
  >
    <template #section-1-heading>
      {{ sections[0].heading }}
      &#8595; 
    </template>
    <template #section-1-content>
      This is my custom content that isn't defined.
      <img src="http://place-hold.it/150" />
    </template>
  </TheAccordion>

</template>

<style scoped>
</style>

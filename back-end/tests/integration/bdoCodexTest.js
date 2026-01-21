import axios from 'axios';

const url = 'https://bdocodex.com/ajax.php?a=skill_list2&class_id=1&l=us';

const response = await axios.get(url);
console.log(response.data);